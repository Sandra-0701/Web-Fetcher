import React from 'react';
import { Table } from 'antd';

const LinkDetailsTable = ({ data }) => {
  // Define columns based on the structure of the data
  const columns = [
    { title: 'Link Type', dataIndex: 'linkType', key: 'linkType' },
    { title: 'Link Text', dataIndex: 'linkText', key: 'linkText', render: (text) => <div dangerouslySetInnerHTML={{ __html: text }} /> },
    { title: 'ARIA Label', dataIndex: 'ariaLabel', key: 'ariaLabel' },
    { title: 'URL', dataIndex: 'url', key: 'url' },
    { title: 'Redirected URL', dataIndex: 'redirectedUrl', key: 'redirectedUrl' },
    { title: 'Status Code', dataIndex: 'statusCode', key: 'statusCode' },
    { title: 'Target', dataIndex: 'target', key: 'target' },
  ];

  // Map the data to include a key for each row
  const dataSource = data.map((link, index) => ({
    key: index, // Unique key for each row
    linkType: link.linkType,          // Type of the link (e.g., internal or external)
    linkText: link.linkText,          // Text of the link
    ariaLabel: link.ariaLabel,        // ARIA label of the link
    url: link.url,                    // URL of the link
    redirectedUrl: link.redirectedUrl, // Redirected URL if applicable
    statusCode: link.statusCode,      // HTTP status code of the link
    target: link.target,              // Target attribute of the link (e.g., _blank)
  }));

  return (
    <Table
      dataSource={dataSource}  // Set the dataSource for the table
      columns={columns}        // Set the columns configuration
      pagination={false}       // Disable pagination
      style={{ marginTop: 20 }} // Add margin for spacing
    />
  );
};

export default LinkDetailsTable;
