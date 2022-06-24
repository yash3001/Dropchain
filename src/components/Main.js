import React, { Component } from "react";
import { convertBytes } from "./helpers";
import moment from "moment";

class Main extends Component {
  render() {
    return (
      <div className="container-fluid mt-5 text-center">
        <div className="row">
          <main
            role="main"
            className="col-lg-12 ml-auto mr-auto"
            style={{ maxWidth: "1024px" }}
          >
            <div className="content">
              {this.props.show ? (
                <>
                  <div
                    className="card mb-3 mx-auto "
                    style={{ maxWidth: "512px", backgroundColor: "#22223B" }}
                  >
                    <h2
                      className=" text-monospace "
                      style={{ color: "#C9ADA7" }}
                    >
                      <b>
                        <ins>Share File</ins>
                      </b>
                    </h2>
                    <form
                      onSubmit={(event) => {
                        event.preventDefault();
                        const description = this.fileDescription.value;
                        this.props.uploadFile(description);
                      }}
                    >
                      <div className="form-group">
                        <br></br>
                        <input
                          id="fileDescription"
                          type="text"
                          ref={(input) => {
                            this.fileDescription = input;
                          }}
                          className="form-control text-monospace"
                          placeholder="description..."
                          required
                        />
                      </div>
                      <input
                        type="file"
                        onChange={this.props.captureFile}
                        className="text-monospace"
                        style={{ color: "#C9ADA7" }}
                      />
                      <button
                        type="submit"
                        className="btn-primary btn-block"
                        style={{ backgroundColor: "#9A8C98", border: "none" }}
                      >
                        <b>Upload!</b>
                      </button>
                    </form>
                  </div>
                  <p>&nbsp;</p>
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={this.props.showHandler}
                    backgroundColor="#22223B"
                  >
                    Show Files
                  </button>
                </>
              ) : (
                <>
                  <table
                    className="table-sm table-bordered text-monospace"
                    style={{ width: "1000px", maxHeight: "450px" }}
                  >
                    <thead style={{ fontSize: "18px" }}>
                      <tr
                        style={{ color: "#C9ADA7", backgroundColor: "#22223B" }}
                      >
                        <th scope="col" style={{ width: "10px" }}>
                          ID
                        </th>
                        <th scope="col" style={{ width: "200px" }}>
                          File Name
                        </th>
                        <th scope="col" style={{ width: "230px" }}>
                          File Description
                        </th>
                        <th scope="col" style={{ width: "120px" }}>
                          File Type
                        </th>
                        <th scope="col" style={{ width: "90px" }}>
                          File Size
                        </th>
                        <th scope="col" style={{ width: "90px" }}>
                          Date
                        </th>
                        <th scope="col" style={{ width: "120px" }}>
                          Uploader
                        </th>
                        <th scope="col" style={{ width: "120px" }}>
                          View File
                        </th>
                        <th scope="col" style={{ width: "120px" }}>
                          Delete File
                        </th>
                      </tr>
                    </thead>
                    {this.props.files.map((file, key) => {
                      return (
                        <thead style={{ fontSize: "12px" }} key={key}>
                          <tr>
                            <td>{file.fileId}</td>
                            <td>{file.fileName}</td>
                            <td>{file.fileDescription}</td>
                            <td>{file.fileType}</td>
                            <td>{convertBytes(file.fileSize)}</td>
                            <td>
                              {moment
                                .unix(file.uploadTime)
                                .format("h:mm:ss A M/D/Y")}
                            </td>
                            <td>
                              <a
                                href={
                                  "https://etherscan.io/address/" +
                                  file.uploader
                                }
                                rel="noopener noreferrer"
                                target="_blank"
                              >
                                {file.uploader.substring(0, 10)}...
                              </a>
                            </td>
                            <td>
                              <a
                                href={
                                  "https://ipfs.infura.io/ipfs/" + file.fileHash
                                }
                                rel="noopener noreferrer"
                                target="_blank"
                              >
                                {file.fileHash.substring(0, 10)}...
                              </a>
                            </td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-danger"
                                onClick={this.props.delete.bind(
                                  this,
                                  file.fileId
                                )}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        </thead>
                      );
                    })}
                  </table>
                  <p>&nbsp;</p>
                  <button
                    type="button"
                    class="btn btn-success"
                    onClick={this.props.showHandler}
                    backgroundColor="#22223B"
                  >
                    Upload More
                  </button>
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    );
  }
}

export default Main;
