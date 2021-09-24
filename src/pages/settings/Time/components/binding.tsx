import { EditOutlined, UploadOutlined } from '@ant-design/icons';
import { Input, List, Form, Upload, Button, message, Tag } from 'antd';
import React, { Fragment } from 'react';
import { getListMeal, uploadMealImage, writeMealData } from '@/services/checkin';
import { getDownloadUrl } from '@/services/firebase';
import SketchExample from '@/share/color-picker';

const BindingView = () => {
  const [form] = Form.useForm();
  const [data, setData] = React.useState<any[]>([]);
  const [saving, setSaving] = React.useState(false);
  const [color, setColor] = React.useState("#da6323");
  const [id, setId] = React.useState<number>(0);
  const [url, setUrl] = React.useState(null);

  React.useEffect(() => {
    getListMeal().then((list) => {
      setData(Object.values(list));
    })
  }, [])

  const onFinish = async (val: any) => {
    setSaving(true);
    let downUrl = url;
    if (val.images) {
      const upload = await uploadMealImage(val.images[0].originFileObj)
      if(upload.state === "success") {
        downUrl = await getDownloadUrl(upload.metadata.fullPath)
      } else {
        message.error("úp hình lỗi rồi :(")
      }
    }
    delete val.images;
    Object.keys(val).forEach(key => {
      if (val[key] === null || val[key] === undefined) {
        delete val[key];
      }
    })
    writeMealData({id: id || new Date().getTime(),avatar: downUrl, color, ...val }).then(() => {
      message.info("Lưu thèn công");
      setSaving(false);
      getListMeal().then((list) => {
        setData(Object.values(list));
      })

      formatForm();
    })
  }

  const formatForm = () => {
    form.resetFields();
    setId(0);
    setUrl(null);
  }

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const update = (item: any) => {
    setId(item.id);
    form.setFieldsValue(item);
    setColor(item.color);
    setUrl(item.avatar)
  }

  return (
    <Fragment>
      <h2>Thêm món ăn</h2>
      <Form
        name="validate_other"
        onFinish={onFinish}
        layout="horizontal"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        form={form}
      >
        <Form.Item
          label="Tên"
          name="title"
          rules={[
            {
              required: true,
              message: "nhập dùm",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Mô tả"
          name="description"
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item label="Thông tin/100gr" style={{ marginBottom: 0 }}>
          <Form.Item
            name="calo"
            style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
          >
            <Input addonAfter="Calo" />
          </Form.Item>
          <Form.Item
            name="fat"
            style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 8px' }}
          >
            <Input addonAfter="Béo" />
          </Form.Item>
        </Form.Item>
        <Form.Item label="Thông tin/100gr" style={{ marginBottom: 0 }}>
          <Form.Item
            name="carb"
            style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
          >
            <Input addonAfter="Carb" />
          </Form.Item>
          <Form.Item
            name="protein"
            style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 8px' }}
          >
            <Input addonAfter="Protein" />
          </Form.Item>
        </Form.Item>
        <Form.Item
          label="Màu"
          name="color"
        >
          <SketchExample color={color} setColor={setColor} />
        </Form.Item>
        <Form.Item
          name="images"
          label="Hình"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[
            {
              required: !url,
              message: "thêm hình dùm",
            },
          ]}
        >
          <Upload maxCount={1} name="logo" action="/upload.do" listType="picture">
            <Button type="ghost" icon={<UploadOutlined />}>Hình của nó</Button>
          </Upload>
        </Form.Item>
        <Form.Item wrapperCol={{ span: 14, offset: 4 }}>
          {id ? (
            <>
              <Button type="primary" htmlType="submit" loading={saving}>
                Lưu thay đổi
              </Button>
              <Button type="default" style={{marginLeft: '10px'}} htmlType="button" onClick={formatForm} loading={saving}>
                Thôi thay đổi
              </Button>
            </>
          ) : (
            <Button type="primary" htmlType="submit" loading={saving}>
              Lưu thôi
            </Button>
          )}
        </Form.Item>
      </Form>
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item) => (
          <List.Item actions={[<EditOutlined onClick={() => update(item)} style={{ fontSize: '25px' }} />]}>
            <List.Item.Meta
              avatar={<img style={{width: '150px', height: 'auto'}} src={item.avatar} />}
              title={<Tag color={item.color}>{item.title}</Tag>}
              description={item.description}
            />
          </List.Item>
        )}
      />
    </Fragment>
  );
}

export default BindingView;
