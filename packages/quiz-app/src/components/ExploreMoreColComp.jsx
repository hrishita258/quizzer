import { Card, Carousel, Col } from 'antd'
import React from 'react'

const ExploreMoreColComp = ({ title, data }) => {
  console.log('data', data)
  return (
    <Col span={8}>
      <h2
        style={{
          borderLeft: `10px solid #ef78b9`,
          paddingLeft: 30,
          fontSize: '20px',
          margin: '30px 0px',
          textTransform: 'uppercase'
        }}
      >
        {title}
      </h2>
      <div style={{ padding: '0px 15px' }}>
        <Carousel slidesPerRow={1} autoplay>
          {data?.result?.hits?.map((item, index) => (
            <div>
              <Card
                key={index}
                bodyStyle={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 15,
                  padding: 5,
                  minHeight: 120
                }}
                style={{
                  margin: '10px',
                  cursor: 'pointer',
                  marginBottom: '30px'
                }}
              >
                <div
                  style={{
                    minWidth: 140,
                    minHeight: 100,
                    background: `url(${item?.banner_mobile?.image_url})`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center'
                  }}
                ></div>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item?.organisation?.name}</p>
                </div>
              </Card>
            </div>
          ))}
        </Carousel>
      </div>
    </Col>
  )
}
export default ExploreMoreColComp
