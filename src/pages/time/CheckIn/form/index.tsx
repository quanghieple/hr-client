import { formatMessage } from 'umi';
import { UploadOutlined } from '@ant-design/icons';
import { Input, Form, Upload, Button, message, Select } from 'antd';
import React, { Fragment } from 'react';
import { getListMeal, getTodayTracking, uploadMealImage, writeTracking } from '@/services/checkin';
import { getDownloadUrl } from '@/services/firebase';
import { Option } from 'antd/lib/mentions';
import MealHistory from '../../MealHistory';

const BindingView = () => {
  const [form] = Form.useForm();
  const [data, setData] = React.useState<any>({});
  const [today, setToday] = React.useState<any[]>([]);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    getListMeal().then((list) => {
      setData(list);
    })

    getTodayTracking().then((todayTracking) => {
      setToday(Object.values(todayTracking));
    })
  }, [])

  const onFinish = async (val: any) => {
    setSaving(true);
    let downUrl: string[] = []
    if (val.images) {
      for (let i = 0; i < val.images.length; i++) {
        const image = val.images[i];
        const upload = await uploadMealImage(image.originFileObj)
        if(upload.state === "success") {
          downUrl.push(await getDownloadUrl(upload.metadata.fullPath));
        } else {
          message.error("úp hình lỗi rồi :(")
        }
      }
    }
    writeTracking({tracking: {images: downUrl, meal: val.meal, note: val.note}}).then(() => {
      message.info("Lưu thèn công");
      setSaving(false);
      form.resetFields()
      getTodayTracking().then((todayTracking) => {
        setToday(Object.values(todayTracking));
      });
    })
  }

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  return (
    <Fragment>
      <Form
        name="validate_other"
        onFinish={onFinish}
        layout="horizontal"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        form={form}
      >
        <Form.Item
            label="Chọn món"
            name="meal"
            rules={[
                {
                  required: true,
                  message: formatMessage({id: 'checkin.form.shift.required'}),
                },
              ]}
        >
            <Select defaultActiveFirstOption={true}>
                {Object.keys(data).map(key => {
                    return <Option value={key} >{data[key].title}</Option>
                })}
            </Select>
        </Form.Item>
        <Form.Item
          label="chú thích hơm"
          name="note"
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          name="images"
          label="Hình"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[
            {
              required: true,
              message: "hình nào",
            },
          ]}
        >
          <Upload multiple maxCount={5} name="logo" action="/upload.do" listType="picture">
            <Button icon={<UploadOutlined />}>Hình của nó</Button>
          </Upload>
        </Form.Item>
        <Form.Item wrapperCol={{ span: 14, offset: 4 }}>
          <Button type="primary" htmlType="submit" loading={saving}>
            Lưu
          </Button>
        </Form.Item>
      </Form>
      <h2>Hôm nay bạn đã ăn</h2>
      <MealHistory list={today} meals={data || {}}/>
    </Fragment>
  );
}

export default BindingView;
