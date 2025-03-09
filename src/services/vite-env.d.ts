/// <reference types="react-scripts" />

declare module '*.json' {
    const value: any;
    export default value;
  }
  
  interface Window {
    ethereum?: {
      request: (args: any) => Promise<any>;
      enable: () => Promise<any>;
    };
    web3?: any;
  }