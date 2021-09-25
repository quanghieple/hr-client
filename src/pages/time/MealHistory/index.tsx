import { Button, List, Tag } from "antd";
import moment from "moment";
import React from "react"
import ImageGallery from 'react-image-gallery';

import "react-image-gallery/styles/css/image-gallery.css";

const MealHistory = (props: any) => {
  const { list, meals, onPrev, onNext, buttonNext } = props;
  const [fullScreen, serFullScreen] = React.useState(false);

  const toItem = (url: string) => ({
    original: url,
    thumbnail: url,
    thumbnailHeight: 60,
    fullScreen: "full",
    ... fullScreen ? {} : {originalHeight: 200}
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
                  <span style={{color: 'black'}}>
                    {tohhmm(item.time) + " "}
                    <Tag color={(meals[item.meal] || {}).color}>{(meals[item.meal] || {}).title}</Tag>
                    {item.capacity ? " " + (item.capacity) + "ml" : ""}
                  </span>
                  <p style={{fontStyle: 'italic', color: 'black'}}>{item.note ? "* " + item.note : "" }</p>
                  <ImageGallery onScreenChange={serFullScreen} autoPlay showIndex thumbnailPosition={fullScreen ? "right" : "bottom"} items={item.images.map((i: any) => toItem(i))} />

                  {buttonNext && (
                    <div style={{float: 'right', marginTop: '20px'}}>
                      <Button onClick={onPrev} type="primary" style={{marginRight: '10px'}}>Trước</Button>
                      <Button onClick={onNext} type="primary" >Sau</Button>
                    </div>
                  )}
                </>
              )}
            />
          </List.Item>
        )}
      />
  )
}

export default MealHistory;
