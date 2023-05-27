import {
  Avatar,
  Card,
  Col,
  Collapse,
  Divider,
  Drawer,
  Empty,
  Image,
  Row,
  Tabs,
  Tag
} from 'antd'
import React, { useEffect, useState } from 'react'
import { AiOutlineHeart } from 'react-icons/ai'
import { FaMedal } from 'react-icons/fa'
import ReactMarkdown from 'react-markdown'
import { getRequest } from '../../../axios/axiosMethods'

const DevfolioHackathonDetailsDrawer = ({
  hackathon,
  open,
  setSelectedDevFolioHackathonId,
  socialLinks
}) => {
  const [projects, setProjects] = useState([])

  useEffect(() => {
    getRequest(
      'opportunity/hackathons/devfolio/project?slug=' + hackathon?.slug
    ).then(res => {
      setProjects(res.data.result)
    })
  }, [hackathon])
  console.log(projects)
  return (
    <Drawer
      open={open}
      destroyOnClose
      size="large"
      closable={false}
      bodyStyle={{ padding: '0px' }}
      onClose={() => {
        setProjects(null)
        setSelectedDevFolioHackathonId(null)
      }}
      width={window.innerWidth > 1180 ? 1150 : '100%'}
    >
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            padding: '.8rem',
            background: hackathon?.hackathon_setting?.primary_color
          }}
        >
          <Image
            width={250}
            preview={false}
            src={hackathon?.hackathon_setting?.logo}
            alt="logo"
          />
          <h3 style={{ color: '#FFF', marginTop: 10, fontSize: 20 }}>
            {hackathon?.tagline}
          </h3>
        </div>
        <div style={{ padding: '0px 2rem' }}>
          <Tabs
            defaultActiveKey="1"
            centered
            size="large"
            items={[
              {
                label: `Overview`,
                key: '1',
                children: (
                  <div style={{ margin: '0px auto', width: '85%' }}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <Image
                        src={hackathon?.cover_img}
                        preview={false}
                        alt=""
                      />
                    </div>
                    <div
                      style={{
                        margin: '4rem 0px',
                        fontSize: '20px',
                        fontWeight: 400,
                        lineHeight: '32px'
                      }}
                    >
                      <ReactMarkdown>{hackathon?.desc}</ReactMarkdown>
                    </div>
                    <Divider orientation="left" orientationMargin={0}>
                      <h2>Social Links</h2>
                    </Divider>
                    <div style={{ marginBottom: '4rem' }}>
                      <Row gutter={[16, 16]}>
                        {Object.keys(hackathon?.hackathon_setting || {})?.map(
                          key =>
                            hackathon?.hackathon_setting[key] !== null &&
                            [
                              'facebook',
                              'twitter',
                              'instagram',
                              'linkedin',
                              'slack',
                              'discord',
                              'medium',
                              'telegram',
                              'site',
                              'contact_email'
                            ].includes(key) ? (
                              <Col key={key} span={8}>
                                <Card bodyStyle={{ padding: '10px' }}>
                                  <div
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '1rem'
                                    }}
                                  >
                                    <div
                                      style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        width: '4rem',
                                        height: '4rem',
                                        backgroundColor: socialLinks.find(
                                          sl => sl.name === key
                                        )?.color,
                                        color: '#FFF',
                                        fontSize: '3rem',
                                        borderRadius: '10%',
                                        boxShadow:
                                          'rgb(3 0 92 / 36%) 0px 1px 5px, rgb(3 0 92 / 48%) 0px 6px 16px'
                                      }}
                                    >
                                      {
                                        socialLinks.find(sl => sl.name === key)
                                          ?.icon
                                      }
                                    </div>
                                    <div>
                                      <b>
                                        {key === 'contact_email'
                                          ? 'Email'
                                          : key.charAt(0).toUpperCase() +
                                            key.slice(1)}
                                      </b>
                                      <h5>
                                        {hackathon?.name}'s{' '}
                                        {key === 'contact_email'
                                          ? 'Email'
                                          : key.charAt(0).toUpperCase() +
                                            key.slice(1)}
                                      </h5>
                                    </div>
                                  </div>
                                  <div
                                    style={{
                                      backgroundColor: 'rgb(240, 244, 255)',
                                      borderRadius: '16px',
                                      width: '100%',
                                      padding: '3px 9px',
                                      marginTop: 15
                                    }}
                                  >
                                    <p
                                      style={{
                                        boxSizing: 'border-box',
                                        margin: '0px',
                                        color: 'rgb(55, 112, 255)',
                                        fontWeight: 600,
                                        display: '-webkit-box',
                                        WebkitLineClamp: 1,
                                        WebkitBoxOrient: 'vertical',
                                        overflowWrap: 'anywhere',
                                        overflow: 'hidden'
                                      }}
                                    >
                                      <a
                                        href={hackathon?.hackathon_setting[key]}
                                        target="__blank"
                                      >
                                        {hackathon?.hackathon_setting[key]}
                                      </a>
                                    </p>
                                  </div>
                                </Card>
                              </Col>
                            ) : null
                        )}
                      </Row>
                    </div>
                    {hackathon?.hackathon_faqs?.length > 0 ? (
                      <>
                        <Divider orientation="left" orientationMargin={0}>
                          <h2>FAQs</h2>
                        </Divider>
                        <Collapse
                          defaultActiveKey={['1']}
                          style={{ marginBottom: '4rem', width: '100%' }}
                        >
                          {hackathon?.hackathon_faqs?.map((faq, index) => (
                            <Collapse.Panel
                              header={
                                <h3
                                  style={{
                                    fontSize: '16px',
                                    fontWeight: 500,
                                    lineHeight: '28px'
                                  }}
                                >
                                  {faq?.question}
                                </h3>
                              }
                              key={faq.uuid}
                            >
                              <div
                                style={{
                                  fontSize: '17px',
                                  fontWeight: 400,
                                  lineHeight: '32px'
                                }}
                              >
                                <ReactMarkdown>{faq?.answer}</ReactMarkdown>
                              </div>
                            </Collapse.Panel>
                          ))}
                        </Collapse>
                      </>
                    ) : null}

                    {hackathon?.sponsor_tiers.length ? (
                      <>
                        <Divider orientation="left" orientationMargin={0}>
                          <h2>Sponsors</h2>
                        </Divider>
                        {hackathon?.sponsor_tiers?.map(tier =>
                          tier?.sponsors.length ? (
                            <Card key={tier.uuid}>
                              <h2>{tier?.name}</h2>
                              <Row gutter={25}>
                                {tier?.sponsors?.map(sponsor => (
                                  <Col
                                    span={8}
                                    key={sponsor.uuid}
                                    style={{
                                      padding: 15,
                                      display: 'flex',
                                      justifyContent: 'center',
                                      alignItems: 'center'
                                    }}
                                  >
                                    <Image
                                      preview={false}
                                      src={sponsor.logo}
                                      width={tier.width - 19}
                                    />
                                  </Col>
                                ))}
                              </Row>
                            </Card>
                          ) : null
                        )}
                      </>
                    ) : null}
                  </div>
                )
              },
              {
                label: `Prizzes`,
                key: '2',
                children: hackathon?.prizes?.length ? (
                  <Row gutter={[20, 25]}>
                    {hackathon?.prizes?.map(prize => (
                      <Col span={12} key={prize.uuid}>
                        <h3>{prize.name}</h3>
                        <Card>
                          <ReactMarkdown>{prize.desc}</ReactMarkdown>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '50vh'
                    }}
                  >
                    <Empty
                      image="https://cdni.iconscout.com/illustration/premium/thumb/reward-4040469-3354555.png"
                      imageStyle={{
                        height: 300
                      }}
                      description={
                        <span>
                          No prizes have been added to this hackathon yet. Check
                          back later!
                        </span>
                      }
                    />
                  </div>
                )
              },
              {
                label: `Speaker and Judges`,
                key: '3',
                children: hackathon?.judges?.length ? (
                  <Row gutter={16}>
                    {hackathon?.judges?.map(judge => (
                      <Col span={6} key={judge.uuid}>
                        <Card
                          hoverable
                          style={{ height: '26.2rem' }}
                          cover={
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: 15
                              }}
                            >
                              <Image
                                preview={false}
                                width={200}
                                height={200}
                                src={judge.profile_img}
                                alt="Judge profile image"
                              />
                            </div>
                          }
                        >
                          <Card.Meta
                            title={judge.name}
                            description={<span>{judge.company?.name}</span>}
                          />
                          <p
                            style={{
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflowWrap: 'anywhere',
                              overflow: 'hidden',
                              marginTop: 7,
                              color: hackathon?.hackathon_setting.primary_color
                            }}
                          >
                            {judge.job_title}
                          </p>
                          <div
                            style={{
                              display: 'flex',
                              gap: 8,
                              fontSize: 25,
                              color: '#ef78b9',
                              marginTop: 15,
                              position: 'absolute',
                              bottom: 10
                            }}
                          >
                            {Object.keys(judge).map(key =>
                              judge[key] !== null &&
                              [
                                'instagram',
                                'twitter',
                                'telegram',
                                'linkedin',
                                'medium',
                                'discord',
                                'slack',
                                'facebook'
                              ].includes(key) ? (
                                <a
                                  href={judge[key]}
                                  className="devfolio-social-links"
                                  key={key}
                                  target="_blank"
                                >
                                  {socialLinks.find(l => l.name === key)?.icon}
                                </a>
                              ) : null
                            )}
                          </div>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '50vh'
                    }}
                  >
                    <Empty
                      image="https://cdni.iconscout.com/illustration/premium/thumb/error-404-4344461-3613889.png"
                      imageStyle={{
                        height: 300
                      }}
                      description={
                        <span>
                          No Judges have been added to this hackathon yet. Check
                          back later!
                        </span>
                      }
                    />
                  </div>
                )
              },
              {
                label: `Projects`,
                key: '4',
                children:
                  projects && projects?.length ? (
                    <Row gutter={15}>
                      {projects.map(project => (
                        <Col span={8} key={project.uuid}>
                          <Card
                            hoverable
                            bodyStyle={{ padding: '10px' }}
                            size="small"
                          >
                            {project?.prizes?.length > 0 ? (
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 2,
                                  shadow: '0 3px 6px rgba(26,26,26,.1)',
                                  overflowX: 'scroll'
                                }}
                              >
                                {project?.prizes?.length
                                  ? project?.prizes?.map(prize => (
                                      <div
                                        style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: 2,
                                          shadow: '0 3px 6px rgba(26,26,26,.1)',
                                          borderRadius: '5px',
                                          padding: '3px'
                                        }}
                                      >
                                        <FaMedal color="#ef78b9" size={25} />
                                        <span>{prize?.name}</span>
                                      </div>
                                    ))
                                  : null}
                              </div>
                            ) : null}
                            <div
                              style={{
                                position: 'relative',
                                height: '190px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                              }}
                            >
                              <Image
                                preview={false}
                                src={
                                  project?.cover_img
                                    ? project?.cover_img
                                    : 'https://imgs.search.brave.com/tHDXasdjBuBLTWM5PGkUDRMNXh04Ol31l0aGP5Mjyc0/rs:fit:675:450:1/g:ce/aHR0cHM6Ly9jZG5p/Lmljb25zY291dC5j/b20vaWxsdXN0cmF0/aW9uL3ByZW1pdW0v/dGh1bWIvYnVzaW5l/c3MtdGVhbS1wbGFu/bmluZy1wcm9qZWN0/LTI3NDEwMzYtMjI4/MDk0MC5wbmc'
                                }
                                style={{ borderRadius: '5px' }}
                              />
                            </div>
                            <Card.Meta
                              style={{ marginTop: 7 }}
                              title={project?.name}
                              description={
                                <p
                                  style={{
                                    display: '-webkit-box',
                                    WebkitLineClamp: 1,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                  }}
                                >
                                  {project.tagline}
                                </p>
                              }
                            />
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                shadow: '0 3px 6px rgba(26,26,26,.1)',
                                overflow: 'hidden',
                                margin: '10px 0px '
                              }}
                            >
                              {project?.hashtags?.length > 0
                                ? project?.hashtags?.map(hashtag => (
                                    <Tag key={hashtag?.uuid} color="red">
                                      {hashtag?.name}
                                    </Tag>
                                  ))
                                : null}
                            </div>

                            <div
                              style={{
                                borderRadius: '5px',
                                padding: '7px',
                                shadow: '0 1px 3px rgba(26,26,26,.1)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                              }}
                            >
                              <Avatar.Group
                                maxCount={5}
                                maxStyle={{
                                  color: '#f56a00',
                                  backgroundColor: '#fde3cf'
                                }}
                              >
                                {project?.members.map(member =>
                                  member.profile_image !== null ? (
                                    <Avatar src={member.profile_image} />
                                  ) : (
                                    <Avatar
                                      style={{ backgroundColor: '#87d068' }}
                                    >
                                      {member.first_name[0].toUpperCase()}
                                      {member.last_name[0].toUpperCase()}
                                    </Avatar>
                                  )
                                )}
                              </Avatar.Group>
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 10
                                }}
                              >
                                <div
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2
                                  }}
                                >
                                  <AiOutlineHeart color="#ef78b9" size={25} />
                                  <span>{project?.likes}</span>
                                </div>
                              </div>
                            </div>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  ) : (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '50vh'
                      }}
                    >
                      <Empty
                        image="https://cdni.iconscout.com/illustration/premium/thumb/error-404-4344461-3613889.png"
                        imageStyle={{
                          height: 300
                        }}
                        description={
                          <span>
                            No Projects have been added to this hackathon yet.
                            Check back later!
                          </span>
                        }
                      />
                    </div>
                  )
              }
            ]}
          />
        </div>
      </div>
    </Drawer>
  )
}
export default DevfolioHackathonDetailsDrawer
