import Dropchain from "../abis/Dropchain.json";
import React, { Component } from "react";
import Navbar from "./Navbar";
import Loading from "./Loading";
import Main from "./Main";
import Web3 from "web3";
import Background from "./Background";
import "./App.css";

const ipfsClient = require("ipfs-http-client");
const ipfs = ipfsClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});

const deletedFilesId = [];

class App extends Component {
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    // Load account
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });
    // Network ID
    const networkId = await web3.eth.net.getId();
    const networkData = Dropchain.networks[networkId];
    if (networkData) {
      // Assign contract
      const dropchain = new web3.eth.Contract(
        Dropchain.abi,
        networkData.address
      );
      this.setState({ dropchain });
      // Get files amount
      const filesCount = await dropchain.methods.fileCount().call();
      this.setState({ filesCount });
      // Load files&sort by the newest
      // let tempFiles = [];
      for (var i = filesCount; i >= 1; i--) {
        const file = await dropchain.methods.files(i).call();
        // let flag = true;
        // for (let i = 0; i < deletedFilesId.length; i++) {
        //   if (deletedFilesId[i] == file.fileId) {
        //     flag = false;
        //     break;
        //   }
        // }
        // if (flag) {
        //   tempFiles.push(file);
        // }
        this.setState({
          files: [file, ...this.state.files],
        });
      }
      // this.setState({
      //   files: tempFiles,
      // });
      // console.log(this.state.files);
    } else {
      window.alert("Dropchain contract not deployed to detected network.");
    }
  }

  // Get file from user
  captureFile = (event) => {
    event.preventDefault();

    const file = event.target.files[0];
    const reader = new window.FileReader();

    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      this.setState({
        buffer: Buffer(reader.result),
        type: file.type,
        name: file.name,
      });
      console.log("buffer", this.state.buffer);
    };
  };

  uploadFile = (description) => {
    console.log("Submitting file to IPFS...");

    // Add file to the IPFS
    ipfs.add(this.state.buffer, (error, result) => {
      console.log("IPFS result", result.size);
      if (error) {
        console.error(error);
        return;
      }

      this.setState({ loading: true });
      // Assign value for the file without extension
      if (this.state.type === "") {
        this.setState({ type: "none" });
      }
      this.state.dropchain.methods
        .uploadFile(
          result[0].hash,
          result[0].size,
          this.state.type,
          this.state.name,
          description
        )
        .send({ from: this.state.account })
        .on("transactionHash", (hash) => {
          this.setState({
            // loading: false,
            type: null,
            name: null,
          });
          window.location.reload();
          // this.loadBlockchainData();
        })
        .on("error", (e) => {
          window.alert("Error");
          this.setState({ loading: false });
        });
    });
  };

  deleteHandler = (id) => {
    let new_files = [];
    for (let i = 0; i < this.state.files.length; i++) {
      if (this.state.files[i].fileId !== id) {
        new_files.push(this.state.files[i]);
      }
    }
    this.setState({ loading: true });
    deletedFilesId.push(id);
    this.setState({
      files: new_files,
    });
    this.state.dropchain.methods
      .deleteFile(id)
      .send({ from: this.state.account })
      .on("transactionHash", (hash) => {
        window.location.reload();
      })
      .on("error", () => {
        window.location.reload();
      });
  };

  showHandler = () => {
    this.setState({
      show: !this.state.show,
    });
  };

  constructor(props) {
    super(props);
    this.state = {
      account: "",
      dropchain: null,
      files: [],
      loading: false,
      type: null,
      name: null,
      show: true,
    };
    this.uploadFile = this.uploadFile.bind(this);
    this.captureFile = this.captureFile.bind(this);
    this.deleteHandler = this.deleteHandler.bind(this);
    this.showHandler = this.showHandler.bind(this);
  }

  render() {
    return (
      <div>
        <Background>
          <Navbar account={this.state.account} />
          {this.state.loading ? (
            <Loading />
          ) : (
            <Main
              files={this.state.files}
              captureFile={this.captureFile}
              uploadFile={this.uploadFile}
              delete={this.deleteHandler}
              show={this.state.show}
              showHandler={this.showHandler}
            />
          )}
        </Background>
      </div>
    );
  }
}

export default App;
