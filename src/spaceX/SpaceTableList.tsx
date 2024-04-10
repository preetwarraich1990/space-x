import React, { useRef, useState } from 'react'
import { useQuery } from '@apollo/client';
import { GET_SPACE_X } from './queries/query';
import type { InputRef } from 'antd';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table } from 'antd';
import type { ColumnsType, ColumnType } from 'antd/es/table';
import Highlighter from 'react-highlight-words';

interface DataType {
    key: React.Key;
    mission_name: string;
    rocket: { rocket_name: string; }
}

type DataIndex = any;

export const SpaceTableList = () => {
  const { loading, error, data } = useQuery(GET_SPACE_X())
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };


const getColumnSearchProps = (dataIndex: any): ColumnType<any> => ({
  filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
    <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
      <Input
        ref={searchInput}
        placeholder={`Search ${dataIndex}`}
        value={selectedKeys[0]}
        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
        onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
        style={{ marginBottom: 8, display: 'block' }}
      />
      <Space>
        <Button
          type="primary"
          onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90 }}
        >
          Search
        </Button>
        <Button
          onClick={() => clearFilters && handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
        <Button
          type="link"
          size="small"
          onClick={() => {
            confirm({ closeDropdown: false });
            setSearchText((selectedKeys as string[])[0]);
            setSearchedColumn(dataIndex);
          }}
        >
          Filter
        </Button>
        <Button
          type="link"
          size="small"
          onClick={() => {
            close();
          }}
        >
          close
        </Button>
      </Space>
    </div>
  ),
  filterIcon: (filtered: boolean) => (
    <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
  ),
  onFilter: (value, record) => {
    return dataIndex === "rocket_name" ? record['rocket']['rocket_name']
      .toString()
      .toLowerCase()
      .includes((value as string).toLowerCase()) : record[dataIndex]
      .toString()
      .toLowerCase()
      .includes((value as string).toLowerCase())
  },
  onFilterDropdownOpenChange: (visible) => {
    if (visible) {
      setTimeout(() => searchInput.current?.select(), 100);
    }
  },
  render: (text) =>
    searchedColumn === dataIndex ? (
      <Highlighter
        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        searchWords={[searchText]}
        autoEscape
        textToHighlight={text ? text.toString() : ''}
      />
    ) : (
      text
    ),
});

const columns: ColumnsType<DataType> = [
  {
    title: '',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Mission Name',
    dataIndex: 'mission_name',
    key: 'missionName',
    ...getColumnSearchProps('mission_name'),
  },
  {
    title: 'Rocket Name',
    dataIndex: 'rocket',
    key: 'rocketName',
    ...getColumnSearchProps('rocket_name'),
    render: (rocket) => rocket.rocket_name
  },
];
const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
  console.log('selectedRowKeys changed: ', newSelectedRowKeys);
  setSelectedRowKeys(newSelectedRowKeys);
};

const rowSelection = {
  selectedRowKeys,
  onChange: onSelectChange,
};
const tableData: DataType[] = data?.launchesPast
  console.log('here is the data', loading, error, tableData)
    return (
      <>
        <div>SpaceTableList</div>
        <Table columns={columns} dataSource={tableData} rowSelection={rowSelection} />;
        </>
    )
}
