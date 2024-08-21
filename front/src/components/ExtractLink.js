import React from 'react';
import { Table } from 'antd';

const ExtractLink = ({ data }) => {
  // Define columns for displaying URLs
  const columns = [
    { title: 'URL', dataIndex: 'url', key: 'url' },
  ];

  // Convert the array of URLs into an array of objects for dataSource
  const dataSource = data.map((url, index) => ({
    key: index, // Unique key for each row
    url,        // URL value
  }));

  return (
    <Table
      dataSource={dataSource}  // Set the dataSource for the table
      columns={columns}        // Set the columns configuration
      pagination={false}       // Disable pagination
    />
  );
};

export default ExtractLink;
