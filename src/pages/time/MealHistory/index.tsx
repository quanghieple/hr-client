import { List, Tag } from "antd";
import moment from "moment";
import React from "react"
import ImageGallery from 'react-image-gallery';

import "react-image-gallery/styles/css/image-gallery.css";

const MealHistory = (props: any) => {
  const { list, meals } = props;

  const toItem = (url: string) => ({
    original: url,
    thumbnail: url,
    originalHeight: 200,
    thumbnailHeight: 60
  })

  const tohhmm = (milliseconds: any) => moment(milliseconds).format('HH:mm')

  return (
    <List
        itemLayout="horizontal"
        dataSource={list}
        renderItem={(item: any) => (
          <List.Item >
            <List.Item.Meta
              description={(
                <>
                  <span style={{color: 'black'}}>{tohhmm(item.time)} - <Tag color={(meals[item.meal] || {}).color}>{(meals[item.meal] || {}).title}</Tag></span>
                  <p style={{fontStyle: 'italic', color: 'black'}}>{item.note ? "* " + item.note : "" }</p>
                  <ImageGallery autoPlay showIndex thumbnailPosition="bottom" items={item.images.map((i: any) => toItem(i))} />
                </>
              )}
            />
          </List.Item>
        )}
      />
  )
}

export default MealHistory;
