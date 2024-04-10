import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Spin } from "antd";
import "antd/dist/antd.css";
import { InfinityTable as Table } from "antd-table-infinity";
import { columns, fetchData } from "./mockData";

class InfiniteTable extends Component {
  state = {
    data: [],
    loading: false
  };
  handleFetch = () => {
    console.log("loading");
    this.setState({ loading: true });
    fetchData(this.state.data.length).then((newData) =>
      this.setState(({ data }) => ({
        loading: false,
        data: data.concat(newData)
      }))
    );
  };

  loadMoreContent = () => (
    <div
      style={{
        textAlign: "center",
        paddingTop: 40,
        paddingBottom: 40,
        border: "1px solid #e8e8e8"
      }}
    >
      <Spin tip="loading..." />
    </div>
  );
  render() {
    return (
      <div>
        {console.log("DATA >>>>>>", this.state.data)}
        <Table
          key="key"
          loading={this.state.loading}
          onFetch={this.handleFetch}
          pageSize={10}
          loadingIndicator={this.loadMoreContent()}
          columns={columns}
          scroll={{ y: 450 }}
          dataSource={this.state.data}
          bordered
          debug
        />
      </div>
    );
  }
}

ReactDOM.render(<InfiniteTable />, document.getElementById("container"));
