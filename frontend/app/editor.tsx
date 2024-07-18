import DownloadOutlined from '@ant-design/icons/lib/icons/DownloadOutlined';
import DownOutlined from '@ant-design/icons/lib/icons/DownOutlined';
import InboxOutlined from '@ant-design/icons/lib/icons/InboxOutlined';
import CheckOutlined from '@ant-design/icons/lib/icons/CheckOutlined';
import UndoOutlined from '@ant-design/icons/lib/icons/UndoOutlined';
import LoadingOutlined from '@ant-design/icons/lib/icons/LoadingOutlined';
import Button from 'antd/es/button/button';
import Row from 'antd/es/row';
import Col from 'antd/es/col';
import Upload from 'antd/es/upload/Upload';
import Divider from 'antd/es/divider';
import message from 'antd/es/message';
import Tree from 'antd/es/tree';
import Layout from 'antd/es/layout';
import Text from "antd/es/typography/Text";
import Flex from "antd/es/flex";
import Dragger from 'antd/es/upload/Dragger';
const { DirectoryTree } = Tree;

import { zip, unzip, Unzipped } from 'fflate/browser';
import { useState, Key } from 'react';
import { saveAs } from 'file-saver';

import type { TreeDataNode, TreeProps, UploadFile } from 'antd';
import type { UploadProps } from 'antd';
import type { ChangeHandler } from './monaco';

import dynamic from "next/dynamic";
const MonacoDiffEditor = dynamic(() => import("./monaco"), {
  ssr: false,
  loading: () => (
    <Flex vertical justify='center' align='center'>
      <span style={{ fontSize: 'xxx-large' }}> <LoadingOutlined /> <br />  </span> Loading...
    </Flex>)
});

const { Sider, Content } = Layout;

export interface DiffEditorProps {
  // oldFileTree: Unzipped | null,
  // newFileTree: Unzipped | null,
  /**
   * An event emitted when tree data changed.
   */
  onOldTreeChange?: (data: Unzipped | null) => void;
  onNewTreeChange?: (data: Unzipped | null) => void;
}


export default function DiffEditor({
  onOldTreeChange,
  onNewTreeChange,
}: DiffEditorProps) {
  const [oldProjectFilename, setOldProjectFilename] = useState("")
  const [newProjectFilename, setNewProjectFilename] = useState("")
  const [oldTreeData, setOldTreeData] = useState<Unzipped | null>(null)
  const [newTreeData, setNewTreeData] = useState<Unzipped | null>(null)
  const [selectedKey, setSelectedKey] = useState('')
  const [expandedKeysOld, setExpandedKeysOld] = useState<Key[]>([])
  const [expandedKeysNew, setExpandedKeysNew] = useState<Key[]>([])

  const updateOld = (data: Unzipped | null, name: string) => {
    setOldProjectFilename(name)
    setOldTreeData(data)
    onOldTreeChange?.(data)
  }
  const updateNew = (data: Unzipped | null, name: string) => {
    setNewProjectFilename(name)
    setNewTreeData(data)
    onNewTreeChange?.(data)
  }

  const makeOrGetDir = (children: TreeDataNode[], key: string, name: string) => {
    const node = children.find((child) => child.title === name)
    if (node) {
      return node
    }
    const newNode: TreeDataNode = {
      title: name,
      key: `${key}/${name}`,
      children: []
    }
    children?.push(newNode)
    return newNode
  }
  const convertZipToTree = (zip: Unzipped | null, other: Unzipped | null) => {
    let root: TreeDataNode[] = []
    if (zip === null) {
      return root
    }
    for (const path in zip) {
      const dirs = path.split('/')
      let current = root
      let currentKey = ''
      for (let i = 0; i < dirs.length - 1; i++) {
        if (dirs[i].length === 0) { continue }
        const t = makeOrGetDir(current, currentKey.toString(), dirs[i])
        if (t.children === undefined) {
          message.error(`Folder and file name collision: ${t.key}.`)
          t.children = []
        }
        currentKey = t.key as string
        current = t.children as TreeDataNode[]
      }
      if (dirs.length === 0 || dirs[dirs.length - 1].length === 0) { continue }
      const leaf: TreeDataNode = {
        title: dirs[dirs.length - 1],
        key: path,
        disabled: other !== null && other[path] === undefined,
        isLeaf: true,
      }
      current.push(leaf)
    }
    return root
  }
  const uploadPropsOld: UploadProps = {
    onChange(info) {
      // console.log(`Processing: ${info.file.name}`, 1.5);
      message.info(`Processing: ${info.file.name}`, 1.5);
      info.fileList[0].originFileObj?.arrayBuffer().then((buffer) => {
        unzip(new Uint8Array(buffer), (err, unzipped) => {
          if (err) {
            message.error(`Unzip file ${info.file.name} failed.`)
          } else {
            // console.log(unzipped);
            updateOld(unzipped, info.file.name)
          }
        });
      }).catch((err) => {
        message.error(`Read file ${info.file.name} failed.`)
      });
    }
  }
  const uploadPropsNew: UploadProps = {
    onChange(info) {
      message.info(`Processing: ${info.file.name}`, 1.5);
      info.fileList[0].originFileObj?.arrayBuffer().then((buffer) => {
        unzip(new Uint8Array(buffer), (err, unzipped) => {
          if (err) {
            message.error(`Unzip file ${info.file.name} failed.`);
          } else {
            // console.log(unzipped)
            updateNew(unzipped, info.file.name)
          }
        });
      }).catch((err) => {
        message.error(`Read file ${info.file.name} failed.`);
      });
    }
  }

  const onSelectTree: TreeProps['onSelect'] = (selectedKeys, info) => {
    if (selectedKeys.length === 0) {
      setSelectedKey('')
    } else {
      // selected folder
      if (!hasFileData(oldTreeData, selectedKeys[0] as string) && !hasFileData(newTreeData, selectedKeys[0] as string)) {
        return
      }
      setSelectedKey(selectedKeys[0] as string)
    }
  }
  const hasFileData = (zip: Unzipped | null, key: string) => { return zip !== null && key.length > 0 && zip[key] !== undefined }
  const getTreeData = (zip: Unzipped | null, key: string) => { return hasFileData(zip, key) ? new TextDecoder().decode((zip as Unzipped)[key]) : '' }
  const original = getTreeData(oldTreeData, selectedKey)
  const modified = getTreeData(newTreeData, selectedKey)
  const onOldChange: ChangeHandler = (value, event) => {
    if (hasFileData(oldTreeData, selectedKey)) {
      (oldTreeData as Unzipped)[selectedKey] = new TextEncoder().encode(value)
    }
  }
  const onNewChange: ChangeHandler = (value, event) => {
    if (hasFileData(newTreeData, selectedKey)) {
      (newTreeData as Unzipped)[selectedKey] = new TextEncoder().encode(value)
    }
  }
  const downloadZip = (zipFile: Unzipped | null, filename: string) => {
    if (zipFile === null) { return }
    zip(zipFile, {
      // The options object is still optional, you can still do just
      // zip(archive, callback)
      level: 0
    }, (err, data) => {
      if (err) {
        message.error(`Create zip file failed.`);
      } else {
        const blob = new Blob([data], { type: 'application/zip' })
        // window.open(URL.createObjectURL(blob), '_blank');
        saveAs(blob, filename, { autoBom: false })
      }
    })
  }
  const options = {
    renderSideBySide: true,
    automaticLayout: true,
    originalEditable: true
  }

  const commonProps: UploadProps = {
    beforeUpload: () => false,
    maxCount: 1,
    accept: 'zip,application/zip,application/x-zip,application/x-zip-compressed',
    multiple: false,
  }

  const UploadWindow = () => (<>
    <Row>
      <Col span={12}>
        <Dragger {...commonProps} {...uploadPropsOld}>
          <p className="ant-upload-drag-icon">
            {oldTreeData === null ? <InboxOutlined /> : <CheckOutlined />}
          </p>
          <p className="ant-upload-text">Old Project</p>
          <p className="ant-upload-hint">
            Click or drag file to this area to upload. <br />
            Support zip latex project. You can download from overleaf.
          </p>
        </Dragger>
      </Col>
      <Col span={12}>
        <Dragger {...commonProps} {...uploadPropsNew}>
          <p className="ant-upload-drag-icon">
            {newTreeData === null ? <InboxOutlined /> : <CheckOutlined />}
          </p>
          <p className="ant-upload-text">New Project</p>
          <p className="ant-upload-hint">
            Click or drag file to this area to upload. <br />
            Support zip latex project. You can download from overleaf.
          </p>
        </Dragger>
      </Col>
    </Row>
    <Flex style={{ marginTop: "5px" }} justify="space-evenly" align="middle">
      <Button icon={<UndoOutlined />} onClick={() => { updateNew(null, ''); updateOld(null, ''); setSelectedKey('') }}>Reset</Button>
    </Flex>
  </>)

  const DiffWindow = () => (<>
    <Layout>
      <Sider width="15%" collapsible={true} theme="light" collapsedWidth={0}>
        <DirectoryTree
          showLine
          switcherIcon={<DownOutlined />}
          defaultExpandedKeys={['0-0-0']}
          onSelect={onSelectTree}
          treeData={convertZipToTree(oldTreeData, newTreeData)}
          expandedKeys={expandedKeysOld}
          onExpand={(expandedKeys) => setExpandedKeysOld(expandedKeys)}
        />
      </Sider>
      <Content>
        <MonacoDiffEditor
          original={original}
          modified={modified}
          options={options}
          onOldChange={onOldChange}
          onNewChange={onNewChange}
        />
      </Content>
      <Sider width="15%" reverseArrow={true} collapsible={true} theme="light" collapsedWidth={0}>
        <DirectoryTree
          showLine
          switcherIcon={<DownOutlined />}
          defaultExpandedKeys={['0-0-0']}
          onSelect={onSelectTree}
          treeData={convertZipToTree(newTreeData, oldTreeData)}
          expandedKeys={expandedKeysNew}
          onExpand={(expandedKeys) => setExpandedKeysNew(expandedKeys)}
        />
      </Sider>
    </Layout>
    <Row style={{ marginTop: "5px" }} justify="space-evenly" align="middle">
      <Col>
        <Button icon={<DownloadOutlined />} onClick={() => { downloadZip(oldTreeData, oldProjectFilename) }}>
          Save
        </Button>
      </Col>
      <Col>
        <Button icon={<UndoOutlined />} onClick={() => { updateNew(null, ''); updateOld(null, ''); setSelectedKey('') }}>Reset</Button>
      </Col>
      <Col>
        <Button icon={<DownloadOutlined />} onClick={() => { downloadZip(newTreeData, newProjectFilename) }}>
          Save
        </Button>
      </Col>
    </Row>
  </>)

  return (<>
    <Row>
      <Col span={12} style={{ display: 'flex', justifyContent: 'center' }}>
        <Text style={{ fontSize: "12pt" }}>Old Project</Text>
      </Col>
      <Col span={12} style={{ display: 'flex', justifyContent: 'center' }}>
        <Text style={{ fontSize: "12pt" }}>New Project</Text>
      </Col>
    </Row>
    <Divider style={{ margin: "5px 0 10px 0" }} />
    {oldTreeData !== null && newTreeData !== null ? <DiffWindow /> : <UploadWindow />}
    {/* <DiffWindow /> <br /> <UploadWindow /> */}
  </>);
}
