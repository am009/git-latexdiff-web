import { Button, Col, Row, Tree, Upload } from "antd";
import { UploadOutlined, DownOutlined } from '@ant-design/icons';
import type { TreeDataNode, TreeProps } from 'antd';

import dynamic from "next/dynamic";
const MonacoDiffEditor = dynamic(() => import("react-monaco-editor/lib/diff"), {
  ssr: false,
});

export default function DiffEditor() {
  const onSelectOld: TreeProps['onSelect'] = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  };
  const onSelectNew: TreeProps['onSelect'] = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  };
  const code1 = "// your original code...";
  const code2 = "// a different version...";
  const options = {
    renderSideBySide: true,
    automaticLayout: true,
    originalEditable: true
  };

  const treeData: TreeDataNode[] = [
    {
      title: 'parent 1',
      key: '0-0',
      children: [
        {
          title: 'parent 1-0',
          key: '0-0-0',
          children: [
            {
              title: 'leaf',
              key: '0-0-0-0',
            },
            {
              title: 'leaf',
              key: '0-0-0-1',
            },
            {
              title: 'leaf',
              key: '0-0-0-2',
            },
          ],
        },
        {
          title: 'parent 1-1',
          key: '0-0-1',
          children: [
            {
              title: 'leaf',
              key: '0-0-1-0',
            },
          ],
        },
        {
          title: 'parent 1-2',
          key: '0-0-2',
          children: [
            {
              title: 'leaf',
              key: '0-0-2-0',
            },
            {
              title: 'leaf',
              key: '0-0-2-1',
            },
          ],
        },
      ],
    },
  ];

  return (<>
    <Row>
      <Col span={12}>
        <Upload beforeUpload={() => false} maxCount={1} accept='zip,application/zip,application/x-zip,application/x-zip-compressed'>
          <Button icon={<UploadOutlined />}>Old Latex Project (zip)</Button>
        </Upload>
      </Col>
      <Col span={12} style={{display: 'flex', justifyContent: 'flex-end'}}>
        <Upload beforeUpload={() => false} maxCount={1} accept='zip,application/zip,application/x-zip,application/x-zip-compressed'>
          <Button icon={<UploadOutlined />}>New Latex Project (zip)</Button>
        </Upload>
      </Col>
    </Row>
    <Row>
      <Col span={4}>
        <Tree
          showLine
          switcherIcon={<DownOutlined />}
          defaultExpandedKeys={['0-0-0']}
          onSelect={onSelectOld}
          treeData={treeData}
        />
      </Col>
      <Col span={16}>
        <MonacoDiffEditor
          original={code1}
          value={code2}
          options={options}
        />
      </Col>
      <Col span={4}>
        <Tree
          showLine
          switcherIcon={<DownOutlined />}
          defaultExpandedKeys={['0-0-0']}
          onSelect={onSelectNew}
          treeData={treeData}
        />
      </Col>
    </Row>
  </>);
}