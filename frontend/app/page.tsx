"use client";
import { UploadOutlined, LoadingOutlined, CheckCircleOutlined, DownloadOutlined, RightOutlined } from '@ant-design/icons';
import Text from "antd/es/typography/Text";
import Title from "antd/es/typography/Title";
import Button from 'antd/es/button/button';
import Upload from 'antd/es/upload/Upload';
import Input from 'antd/es/input/Input';
import Tooltip from 'antd/es/tooltip';
import Select from 'antd/es/select';
import ColorPicker from 'antd/es/color-picker/ColorPicker';
import Tabs from 'antd/es/tabs';
import TextArea from 'antd/es/input/TextArea';
import Paragraph from 'antd/es/typography/Paragraph';
import Checkbox from 'antd/es/checkbox/Checkbox';
import Progress from 'antd/es/progress/progress';
import Space from 'antd/es/space';
import Flex from 'antd/es/flex';

import Giscus from './giscus';
import { useState, useEffect } from 'react';
import { Divider, Form } from 'antd';
import { Color } from 'antd/es/color-picker';
import { ColorFactory } from 'antd/es/color-picker/color';
import message from 'antd/es/message';
import DiffEditor from './editor';
const { Option } = Select;

export default function Home() {
  const [dockerCmd, setDockerCmd] = useState("docker run --rm -v <path-to-folder>:/work am009/latexdiff-web-worker");
  const [configJson, setConfigJson] = useState("");
  const [pdfURL, setPdfURL] = useState("");
  const [zipURL, setZipURL] = useState("");
  const [dockerOut, setDockerOut] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sendProgress, setSendProgress] = useState(1);
  const [receiveProgress, setReceiveProgress] = useState(1);
  const [currentTab, setCurrentTab] = useState("editor");
  const [currentScheme, setCurrentScheme] = useState("https://");
  const selectBefore = (
    <Tooltip title="Cannot mix http/https. Please change this page's URL scheme and refresh.">
      <Select disabled value={currentScheme}>
        <Option value="http://">http://</Option>
        <Option value="https://">https://</Option>
      </Select>
    </Tooltip>
  );
  // const defaultStyle = {
  //   "new_text": { "color": [0, 0, 255], "style": null },
  //   "old_text": { "color": [255, 0, 0], "style": "strikeout" },
  // };
  const [style, setStyle] = useState("custom");
  const [newTextColor, setNewTextColor] = useState<Color>(new ColorFactory("#0000ff"));
  const [oldTextColor, setOldTextColor] = useState<Color>(new ColorFactory('#ff0000'));
  const [newTextNull, setNewTextNull] = useState(false);
  const [oldTextNull, setOldTextNull] = useState(false);
  const [newColorNull, setNewColorNull] = useState(false);
  const [oldColorNull, setOldColorNull] = useState(false);
  const [newTextStyle, setNewTextStyle] = useState("none");
  const [oldTextStyle, setOldTextStyle] = useState("strikeout");
  const isNewTextVisible = () => {
    if (style === 'custom' && newTextNull === false) {
      return true;
    }
    return false;
  }
  const isOldTextVisible = () => {
    if (style === 'custom' && oldTextNull === false) {
      return true;
    }
    return false;
  }
  useEffect(() => {
    setCurrentScheme(location.protocol === "https:" ? "https://" : "http://");
  }, []);

  const [fields, setFields] = useState({
    "api_endpoint": "backend.latexdiff.cn",
    "main_tex": "main.tex",
    "other_cmdlines": "--latexopt -shell-escape --ignore-latex-errors",
    "download_diff_proj": false,
    "bib": "none"
  });
  const genConfig = () => {
    let config: any = {
      "other_cmdlines": fields.other_cmdlines,
      "main_tex": fields.main_tex,
      "bib": fields.bib === 'none' ? null : fields.bib,
    };
    if (style !== 'custom') {
      config["style"] = style;
    } else {
      config["style"] = {
        "new_text": {
          "color": newColorNull ? null : color2arr(newTextColor),
          "style": newTextStyle === 'none' ? null : newTextStyle,
        },
        "old_text": {
          "color": oldColorNull ? null : color2arr(oldTextColor),
          "style": oldTextStyle === 'none' ? null : oldTextStyle,
        }
      };
      if (newTextNull) {
        config.style.new_text = null;
      }
      if (oldTextNull) {
        config.style.old_text = null;
      }
    }
    return config;
  }
  // https://stackoverflow.com/a/62392022/13798540
  const dataToBlobURL = (data: string) => {
    const byteString = window.atob(data);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'application/pdf' });
    return URL.createObjectURL(blob);
  }

  const handleResponse = (data: any) => {
    setDockerOut(data.docker_output);
    setDockerCmd(data.docker_cmd);
    // download the diff project zip.
    if (data.diff_proj !== null) {
      setZipURL(dataToBlobURL(data.diff_proj));
    }
    // download the diff pdf
    if (data.diff_pdf !== null) {
      let url = dataToBlobURL(data.diff_pdf);
      setPdfURL(url);
      window.open(url, '_blank');
    } else {
      message.error("Failed to generate diff pdf.", 6);
    }
  }
  // Submitting the form
  const onFinish = (values: any) => {
    console.log("Success:", values);
    let form = new FormData();
    form.append("old_zip", values.old_zip[0].originFileObj);
    form.append("new_zip", values.new_zip[0].originFileObj);
    let config = genConfig();
    setConfigJson(JSON.stringify(config));
    console.log("Current config:", config);
    form.append("config", JSON.stringify(config));
    form.append("download_diff_proj", fields.download_diff_proj ? "true" : "false");

    // reset all progress
    setIsLoading(true);
    setSendProgress(0);
    setReceiveProgress(0);
    setDockerOut('');
    setPdfURL('');
    setZipURL('');
    setCurrentTab("result");

    const xhr = new XMLHttpRequest();
    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        console.log("upload progress:", event.loaded / event.total);
        setSendProgress(event.loaded / event.total);
      }
    });
    xhr.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        console.log("download progress:", event.loaded / event.total);
        setReceiveProgress(event.loaded / event.total);
      }
    });
    xhr.onerror = function (event) {
      // cannot get detailed error message here.
      console.log("An error occurred during the request");
      message.error("An error occurred during the request", 6);
    };
    xhr.addEventListener("loadend", (event) => {
      setIsLoading(false);
    });
    xhr.onload = function (e) {
      console.log(`${e.loaded} bytes transferred\n`);
      if (xhr.status != 200) {
        console.error("Error:", xhr.statusText);
        message.error("request failed: " + xhr.statusText, 6);
      } else {
        handleResponse(JSON.parse(xhr.responseText));
      }
    };
    xhr.open('POST', currentScheme + fields.api_endpoint + '/latexdiff', true);
    xhr.send(form);

    // fetch(currentScheme + fields.api_endpoint, {
    //   method: "POST",
    //   body: form,
    // }).then((res) => {
    //   return res.json();
    // }).then((data) => {
    //   setIsLoading(false);
    //   console.log("post success: ", data);
    //   message.success("Diff request sent successfully.");
    // }).catch((error) => {
    //   setIsLoading(false);
    //   console.error("Error:", error);
    //   message.error("Failed to send diff request.", 6);
    // });
  }
  const onFinishFailed = (errorInfo: any) => {
    message.error(errorInfo.errorFields[0].errors[0], 6);
    console.log("Failed:", errorInfo);
  };
  const normFile = (e: any) => {
    // console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };
  const color2arr = (color: Color) => {
    let c = color.toRgb();
    return [c.r, c.g, c.b];
  }
  let customStyle = (<div>
    <Divider>Custom Style Options</Divider>
    <Form.Item hidden={style !== 'custom'}>
      <Checkbox defaultChecked onChange={val => setNewTextNull(!val.target.checked)}>Show new text</Checkbox>
      <Checkbox disabled={!isNewTextVisible()} onChange={val => setNewColorNull(!val.target.checked)} defaultChecked>Change Color</Checkbox>
      <ColorPicker disabled={!isNewTextVisible() || newColorNull} disabledAlpha value={newTextColor} showText onChange={
        (color, hex) => {
          setNewTextColor(color);
        }
      } />

      <span>Text style: </span>
      <Select
        disabled={!isNewTextVisible()}
        value={newTextStyle}
        style={{ width: 120 }}
        onChange={value => setNewTextStyle(value)}
        options={[
          { value: 'none', label: 'none' },
          { value: 'underline_wave', label: 'underline_wave' },
          { value: 'strikeout', label: 'strikeout' },
        ]}
      />
    </Form.Item>
    <Form.Item hidden={style !== 'custom'}>
      <Checkbox defaultChecked onChange={val => setOldTextNull(!val.target.checked)}>Show removed text</Checkbox>
      <Checkbox disabled={!isOldTextVisible()} onChange={val => setOldColorNull(!val.target.checked)} defaultChecked>Change Color to</Checkbox>
      <ColorPicker disabled={!isOldTextVisible() || oldColorNull} disabledAlpha value={oldTextColor} showText onChange={
        (color: Color, hex) => {
          setOldTextColor(color);
        }
      } />
      <span>Text style: </span>
      <Select
        disabled={!isOldTextVisible()}
        value={oldTextStyle}
        style={{ width: 120 }}
        onChange={value => setOldTextStyle(value)}
        options={[
          { value: 'none', label: 'none' },
          { value: 'underline_wave', label: 'underline_wave' },
          { value: 'strikeout', label: 'strikeout' },
        ]}
      />
    </Form.Item>
    <Divider />
  </div>)
  let form = (
    <div style={{
      maxWidth: "600px",
      margin: "0 auto",
    }}>
      <Form layout="horizontal" onFinish={onFinish} onFinishFailed={onFinishFailed}>
        <Form.Item label="API Endpoint:">
          <Input addonBefore={selectBefore} suffix="/latexdiff" value={fields.api_endpoint} onChange={e => setFields({ ...fields, api_endpoint: e.target.value })} />
        </Form.Item>
        <Form.Item required name="old_zip"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          label="Old version of zip project downloaded from Overleaf:"
          rules={[{ required: true, message: 'Please select old project zip file!' }]}>
          <Upload beforeUpload={() => false} maxCount={1} accept='zip,application/zip,application/x-zip,application/x-zip-compressed'>
            <Button icon={<UploadOutlined />}>Select Old Latex zip project</Button>
          </Upload>
        </Form.Item>
        <Form.Item required name="new_zip"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          label="New version of zip project downloaded from Overleaf:"
          rules={[{ required: true, message: 'Please select new project zip file!' }]}>
          <Upload beforeUpload={() => false} maxCount={1} accept='zip,application/zip,application/x-zip,application/x-zip-compressed'>
            <Button icon={<UploadOutlined />}>Select New Latex zip project</Button>
          </Upload>
        </Form.Item>
        <Form.Item label="Main tex filename:">
          <Input placeholder="main.tex" value={fields.main_tex} onChange={e => setFields({ ...fields, main_tex: e.target.value })} />
        </Form.Item>

        <Form.Item label="Other git-latexdiff options:">
          <Input value={fields.other_cmdlines} onChange={e => setFields({ ...fields, other_cmdlines: e.target.value })} />
        </Form.Item>
        <Form.Item label="Diff text style:">
          <Select
            defaultValue="custom"
            style={{ width: 120 }}
            onChange={value => setStyle(value)}
            options={[
              { value: 'custom', label: 'Custom' },
              { value: 'UNDERLINE', label: 'UNDERLINE' },
              { value: 'CTRADITIONAL', label: 'CTRADITIONAL' },
              { value: 'TRADITIONAL', label: 'TRADITIONAL' },
              { value: 'CFONT', label: 'CFONT' },
              { value: 'FONTSTRIKE', label: 'FONTSTRIKE' },
              { value: 'INVISIBLE', label: 'INVISIBLE' },
              { value: 'CHANGEBAR', label: 'CHANGEBAR' },
              { value: 'CCHANGEBAR', label: 'CCHANGEBAR' },
              { value: 'CULINECHBAR', label: 'CULINECHBAR' },
              { value: 'CFONTCHBAR', label: 'CFONTCHBAR' },
              { value: 'BOLD', label: 'BOLD' },
              { value: 'PDFCOMMENT', label: 'PDFCOMMENT' },
            ]}
          />
        </Form.Item>
        {style !== 'custom' ? (<div></div>) : customStyle}
        <Form.Item label="Bibliography">
          <Select
            value={fields.bib}
            style={{ width: 200 }}
            onChange={value => { setFields({ ...fields, bib: value }); }}
            options={[
              { value: 'none', label: 'don\'t show bib' },
              { value: 'bibtex', label: 'bibtex' },
              { value: 'biber', label: 'biber' },
            ]}
          />
        </Form.Item>
        <Form.Item>
          <Checkbox onChange={e => { setFields({ ...fields, download_diff_proj: e.target.checked }); }}>
            Additionally download the diffed latex project as a tar file
          </Checkbox>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit"><UploadOutlined />Submit</Button>
        </Form.Item>
      </Form>
    </div>
  );
  let result = (
    <div style={{
      maxWidth: "600px",
      margin: "0 auto",
    }}>
      <Title level={3}>Request Progress</Title>
      <Paragraph strong>
        <ul>
          <li>
            Sending the request:
            <Progress percent={sendProgress * 100} />
          </li>
          <li>
            Processing: {isLoading ? <LoadingOutlined /> : <CheckCircleOutlined />}
          </li>
          <li>
            Receiving the result:
            <Progress percent={receiveProgress * 100} />
          </li>
        </ul>
      </Paragraph>

      <Space>
        <Button type="primary" icon={<DownloadOutlined />} disabled={pdfURL.length === 0} target="_blank" href={pdfURL}>
          Download Diff PDF
        </Button>
        <Tooltip title="Select the download project option first.">
          <Button type="primary" icon={<DownloadOutlined />} disabled={zipURL.length === 0} download="diff_proj.tar" href={zipURL}>
            Download Diff project TAR
          </Button>
        </Tooltip>
      </Space>

      <Title level={3}>Docker Output</Title>
      <TextArea value={dockerOut} readOnly rows={8} />
      <Title level={3}>Reproduction</Title>
      <Text strong>To reproduce this diff run:</Text>
      <Paragraph>
        <ul>
          <li>
            Prepare a folder with new.zip, old.zip, and config.json.
            The content of config.json is the following:
            <Paragraph code copyable>{configJson}</Paragraph>
          </li>
          <li>
            Run the following docker command:
            <Paragraph code copyable>{dockerCmd}</Paragraph>
          </li>
          <li>
            The result pdf path is &lt;path-to-folder&gt;/diff.pdf. The result latex project is at &lt;path-to-folder&gt;/git-latexdiff/new.
          </li>
        </ul>
      </Paragraph>

    </div>
  );
  let editor = (<div><DiffEditor /></div>)

  let next = (<Button icon={<RightOutlined />} type='primary'> Next </Button>)
  return (
    <div>
      <Flex align="center" vertical>
        <Title style={{ fontSize: "19pt" }}><a href="https://github.com/am009/git-latexdiff-web">git-latexdiff web</a></Title>
      </Flex>
      <Tabs
        activeKey={currentTab}
        size="small"
        centered
        onChange={(key) => setCurrentTab(key)}
        tabBarExtraContent={{right: next}}
        items={[
          { label: "Editor", key: "editor", children: editor },
          { label: "Settings", key: "settings", children: form },
          { label: "Result", key: "result", children: result },
        ]}
      />
      <br />
      <div style={{
        maxWidth: "600px",
        margin: "0 auto",
      }}>
        <Flex align="center" vertical>
          <Text strong><a href="https://github.com/am009/git-latexdiff-web">git-latexdiff web</a> is an online tool based on <a target="_blank" href="https://github.com/ftilmann/latexdiff">latexdiff</a> and <a target="_blank" href="https://gitlab.com/git-latexdiff/git-latexdiff">git-latexdiff</a></Text>
          <Text strong> <a target="_blank" href="https://github.com/am009/git-latexdiff-web">Source code on Github</a> / <a target="_blank" href="https://github.com/am009/git-latexdiff-web">Use it offline</a></Text>
        </Flex>
        <br />
        <Giscus
          id="comments"
          repo="am009/git-latexdiff-web"
          repoId="R_kgDOKDZDvQ"
          category="Giscus"
          categoryId="DIC_kwDOKDZDvc4CfHLj"
          mapping="pathname"
          reactionsEnabled="1"
          emitMetadata="0"
          inputPosition="top"
          theme="preferred_color_scheme"
          lang="en" />
      </div>
    </div>
  );
}
