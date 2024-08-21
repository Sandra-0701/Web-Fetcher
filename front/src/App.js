import React, { useState } from 'react';
import { Input, Select, Checkbox, Button, Table, message } from 'antd';
import * as XLSX from 'xlsx';
import { fetchData } from './api';
import LinkDetailsTable from './components/LinkDetailsTable';
import ImageDetailsTable from './components/ImageDetailsTable';
import VideoDetailsTable from './components/VideoDetailsTable';
import PagePropertiesTable from './components/PagePropertiesTable';
import HeadingHierarchyTable from './components/HeadingHierarchyTable';
import ExtractLink from './components/ExtractLink';

const { Option } = Select;

const App = () => {
  const [url, setUrl] = useState('');
  const [dataType, setDataType] = useState('all-details');
  const [includeUhf, setIncludeUhf] = useState(true);
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [allDetails, setAllDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFetchData = async () => {
    setLoading(true);
    try {
      console.log('Fetching data with:', { url, dataType, includeUhf });
      const responseData = await fetchData(url, dataType, includeUhf);
      console.log('Received data:', responseData);

      if (dataType === 'all-details') {
        setAllDetails({
          links: responseData.links || [],
          images: responseData.images || [],
          videos: responseData.videos || [],
          pageProperties: responseData.pageProperties || [],
          headings: responseData.headings || [],
        });
      } else {
        setData(responseData[dataType] || []);

        let newColumns = [];
        switch (dataType) {
          case 'link-details':
            newColumns = [
              { title: 'Text', dataIndex: 'text', key: 'text' },
              { title: 'Href', dataIndex: 'href', key: 'href' },
              { title: 'Target', dataIndex: 'target', key: 'target' },
            ];
            break;
          case 'image-details':
            newColumns = [
              { title: 'Src', dataIndex: 'src', key: 'src' },
              { title: 'Alt', dataIndex: 'alt', key: 'alt' },
            ];
            break;
          case 'video-details':
            newColumns = [
              { title: 'Src', dataIndex: 'src', key: 'src' },
              { title: 'Type', dataIndex: 'type', key: 'type' },
            ];
            break;
          case 'page-properties':
            newColumns = [
              { title: 'Property', dataIndex: 'property', key: 'property' },
              { title: 'Value', dataIndex: 'value', key: 'value' },
            ];
            break;
          case 'heading-hierarchy':
            newColumns = [
              { title: 'Level', dataIndex: 'level', key: 'level' },
              { title: 'Text', dataIndex: 'text', key: 'text' },
            ];
            break;
          case 'extract-urls':
            newColumns = [
              { title: 'URL', dataIndex: 'text', key: 'text' },
            ];
            break;
          default:
            newColumns = [];
        }
        setColumns(newColumns);
      }
    } catch (error) {
      console.error('Error in handleFetchData:', error);
      message.error('Failed to fetch data.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadExcel = () => {
    if (allDetails) {
      const sheetData = {
        'Link Details': allDetails.links,
        'Image Details': allDetails.images,
        'Video Details': allDetails.videos,
        'Page Properties': allDetails.pageProperties,
        'Heading Details': allDetails.headings,
      };

      const workbook = XLSX.utils.book_new();
      Object.keys(sheetData).forEach(sheetName => {
        const worksheet = XLSX.utils.json_to_sheet(sheetData[sheetName]);
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
      });
      XLSX.writeFile(workbook, 'data.xlsx');
    } else {
      message.error('No data available to download.');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Web Page Data Extractor</h1>
      <Input
        placeholder="Enter URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{ marginBottom: 10 }}
      />
      <Select
        value={dataType}
        onChange={(value) => setDataType(value)}
        style={{ width: 200, marginBottom: 10 }}
      >
        <Option value="extract-urls">Extract URLs</Option>
        <Option value="link-details">Link Details</Option>
        <Option value="image-details">Image Details</Option>
        <Option value="video-details">Video Details</Option>
        <Option value="page-properties">Page Properties</Option>
        <Option value="heading-hierarchy">Heading Hierarchy</Option>
        <Option value="all-details">All Details</Option>
      </Select>
      <Checkbox
        checked={includeUhf}
        onChange={(e) => setIncludeUhf(e.target.checked)}
        style={{ marginBottom: 10 }}
      >
        Include UHF
      </Checkbox>
      <Button onClick={handleFetchData} type="primary" style={{ marginBottom: 10 }} loading={loading}>
        Fetch Data
      </Button>
      <Button onClick={handleDownloadExcel} type="default" style={{ marginBottom: 20 }}>
        Download as Excel
      </Button>

      {/* Conditionally render the tables based on the selected dataType */}
      {dataType === 'all-details' && allDetails && (
        <>
          {allDetails.links && <LinkDetailsTable data={allDetails.links} />}
          {allDetails.images && <ImageDetailsTable data={allDetails.images} />}
          {allDetails.videos && <VideoDetailsTable data={allDetails.videos} />}
          {allDetails.pageProperties && <PagePropertiesTable data={allDetails.pageProperties} />}
          {allDetails.headings && <HeadingHierarchyTable data={allDetails.headings} />}
        </>
      )}

      {dataType === 'extract-urls' && <ExtractLink data={data} />}
      {dataType === 'link-details' && <LinkDetailsTable data={data} />}
      {dataType === 'image-details' && <ImageDetailsTable data={data} />}
      {dataType === 'video-details' && <VideoDetailsTable data={data} />}
      {dataType === 'page-properties' && <PagePropertiesTable data={data} />}
      {dataType === 'heading-hierarchy' && <HeadingHierarchyTable data={data} />}

      {dataType !== 'all-details' && (
        <Table
          dataSource={data.map((item, index) => ({ key: index, ...item }))}
          columns={columns}
          pagination={false}
          loading={loading}
        />
      )}
    </div>
  );
};

export default App;
