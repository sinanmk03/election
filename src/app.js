App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  hasVoted: false,

  init: function () {
    return App.initWeb3();
  },

  initWeb3: function () {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function () {
    $.getJSON("Election.json", function (election) {
      App.contracts.Election = TruffleContract(election);
      App.contracts.Election.setProvider(App.web3Provider);

      App.listenForEvents();
      return App.render();
    });
  },

  listenForEvents: function () {
    App.contracts.Election.deployed().then(function (instance) {
      instance.votedEvent({}, {
        fromBlock: 'latest'
      }).watch(function (error, event) {
        console.log("Event triggered", event);
        App.render(); // Re-render when a vote is cast
      });
    });
  },

  render: async function () {
    var electionInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    web3.eth.getCoinbase(function (err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    App.contracts.Election.deployed().then(async function (instance) {
      electionInstance = instance;
      return electionInstance.candidatesCount();
    }).then(async function (candidatesCount) {
      var candidatesContainer = $("#candidatesContainer");
      candidatesContainer.empty(); // Clear previous candidates before appending

      for (var i = 1; i <= candidatesCount; i++) {
        let candidate = await electionInstance.candidates(i);
        let id = candidate[0].toNumber();
        let name = candidate[1];
        let voteCount = candidate[2].toNumber();

        let candidateCard = `
          <div class="col-md-4 mb-3">
              <div class="card p-3 border rounded shadow-sm text-center">
                  <h5>${name}</h5>
                  <p>Votes: <strong>${voteCount}</strong></p>
                  <button class="btn btn-primary vote-btn" data-id="${id}">Vote</button>
              </div>
          </div>
        `;

        candidatesContainer.append(candidateCard);
      }

      return electionInstance.voters(App.account);
    }).then(function (hasVoted) {
      if (hasVoted) {
        $(".vote-btn").prop("disabled", true);
      }
      loader.hide();
      content.show();
    }).catch(function (error) {
      console.warn(error);
    });
  },

  castVote: function (candidateId) {
    App.contracts.Election.deployed().then(function (instance) {
      return instance.vote(candidateId, { from: App.account });
    }).then(function (result) {
      $("#content").hide();
      $("#loader").show();
    }).catch(function (err) {
      console.error(err);
    });
  },

  // Fetch and display results
  fetchResults: async function () {
    try {
      const accounts = await web3.eth.getAccounts();
      const electionInstance = await App.contracts.Election.deployed();
      const candidatesCount = await electionInstance.candidatesCount();

      // Hide loader and show content
      document.getElementById('loader').style.display = 'none';
      document.getElementById('content').style.display = 'block';

      // Fetch and display candidate results
      const candidatesContainer = document.getElementById('candidatesContainer');
      candidatesContainer.innerHTML = '';  // Clear previous candidates

      for (let i = 1; i <= candidatesCount; i++) {
        let candidate = await electionInstance.candidates(i);
        let id = candidate[0].toNumber();
        let name = candidate[1];
        let voteCount = candidate[2].toNumber();

        const candidateCard = `
          <div class="col-md-4 mb-3">
              <div class="candidate-card">
                  <h5>${name}</h5>
                  <p>Votes: <strong>${voteCount}</strong></p>
              </div>
          </div>
        `;
        candidatesContainer.insertAdjacentHTML('beforeend', candidateCard);
      }

      document.getElementById('accountAddress').innerText = `Connected Account: ${accounts[0]}`;
    } catch (error) {
      console.error(error);
      alert('Error fetching results.');
    }
  }
};

$(function () {
  $(window).load(function () {
    App.init();
  });

  // Event delegation for dynamically added elements
  $(document).on("click", ".vote-btn", function () {
    let candidateId = $(this).data("id");
    App.castVote(candidateId);
  });
});
