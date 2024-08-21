import React from 'react';
import { Table } from 'antd';

const PagePropertiesTable = ({ data }) => {
  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Content', dataIndex: 'content', key: 'content' },
  ];

  // Ensure data is an array and has the correct structure
  const dataSource = Array.isArray(data) ? data.map((meta, index) => ({
    key: index, // Unique key for each row
    name: meta.name,     // Meta tag name or property
    content: meta.content || 'No Content', // Meta tag content, default if not present
  })) : [];

  return (
    <Table
      dataSource={dataSource}  // Set the dataSource for the table
      columns={columns}        // Set the columns configuration
      pagination={false}       // Disable pagination
      style={{ marginTop: 20 }} // Add margin for spacing
    />
  );
};

export default PagePropertiesTable;
