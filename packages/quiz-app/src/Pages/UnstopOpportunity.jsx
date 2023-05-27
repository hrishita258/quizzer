import {
  Avatar,
  Badge,
  Button,
  Carousel,
  Col,
  Drawer,
  Image,
  Row,
  Tag
} from 'antd'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { AiOutlineFileImage } from 'react-icons/ai'
import { BiRupee } from 'react-icons/bi'
import { BsCircleFill } from 'react-icons/bs'
import {
  FaCalendarAlt,
  FaEnvelope,
  FaPhoneAlt,
  FaUserAlt
} from 'react-icons/fa'
import { FiUserCheck } from 'react-icons/fi'
import { ImDownload3, ImUsers } from 'react-icons/im'
import { IoLocationOutline } from 'react-icons/io5'
import { useParams } from 'react-router-dom'
import { getRequest } from '../axios/axiosMethods'

const themeColors = [
  {
    name: 'blue',
    color: 'rgb(0, 115, 230)',
    light: '#0073e64d'
  },
  {
    name: 'light-blue',
    color: 'rgb(3, 157, 227)',
    light: '#039de54d'
  },
  {
    name: 'light-blue-dark',
    color: 'rgb(41, 98, 255)',
    light: '#2962ff4d'
  },
  {
    name: 'blue-dark',
    color: 'rgb(13, 71, 161)',
    light: '#0d47a14d'
  },
  {
    name: 'cyan-dark',
    color: 'rgb(0, 96, 100)',
    light: '#0064604d'
  },
  {
    name: 'indigo',
    color: 'rgb(63, 81, 181)',
    light: '#3f51b54d'
  },
  {
    name: 'indigo-dark',
    color: 'rgb(26, 35, 126)',
    light: '#1a237e4d'
  },
  {
    name: 'deep-purple',
    color: 'rgb(103, 58, 183)',
    light: '#673ab74d'
  },
  {
    name: 'purple',
    color: 'rgb(156, 39, 176)',
    light: '#9c27b04d'
  },
  {
    name: 'purple-dark',
    color: 'rgb(74, 20, 140)',
    light: '#4a148c4d'
  },
  {
    name: 'deep-purple-dark',
    color: 'rgb(98, 0, 234)',
    light: '#6200ea4d'
  },
  {
    name: 'amber',
    color: 'rgb(194, 137, 0)',
    light: '#c289004d'
  },
  {
    name: 'amber-dark',
    color: 'rgb(235, 0, 0)',
    light: '#eb00004d'
  },
  {
    name: 'orange',
    color: 'rgb(214, 128, 0)',
    light: '#d680004d'
  },
  {
    name: 'dark-orange',
    color: 'rgb(211, 61, 13)',
    light: '#d33d0d4d'
  },
  {
    name: 'deep-orange',
    color: 'rgb(214, 53, 0)',
    light: '#d635004d'
  },
  {
    name: 'red',
    color: 'rgb(214, 53, 0)',
    light: '#d635004d'
  },
  {
    name: 'red-dark',
    color: 'rgb(183, 28, 28)',
    light: '#b71c1c4d'
  },
  {
    name: 'pink',
    color: 'rgb(223, 22, 90)',
    light: '#df165a4d'
  },
  {
    name: 'pink-dark',
    color: 'rgb(136, 14, 79)',
    light: '#880e4f4d'
  },
  {
    name: 'light-green',
    color: 'rgb(111, 160, 54)',
    light: '#6fa0364d'
  },
  {
    name: 'green',
    color: 'rgb(56, 132, 59)',
    light: '#38843b4d'
  },
  {
    name: 'green-dark',
    color: 'rgb(27, 94, 32)',
    light: '#1b5e204d'
  },
  {
    name: 'teal',
    color: 'rgb(0, 133, 118)',
    light: '#0085764d'
  },
  {
    name: 'teal-dark',
    color: 'rgb(0, 77, 64)',
    light: '#004d404d'
  },
  {
    name: 'blue-grey',
    color: 'rgb(96, 120, 139)',
    light: '#60788b4d'
  },
  {
    name: 'brown',
    color: 'rgb(121, 85, 72)',
    light: '#7955484d'
  },
  {
    name: 'black',
    color: 'rgb(0, 0, 0)',
    light: '#0000004d'
  },
  {
    name: 'color-bg1',
    color: 'rgb(184, 20, 78)',
    light: '#b8144e4d'
  },
  {
    name: 'color-bg2',
    color: 'rgb(1, 127, 78)',
    light: '#017f4e4d'
  },
  {
    name: 'color-bg3',
    color: 'rgb(34, 13, 140)',
    light: '#220d8c4d'
  },
  {
    name: 'color-bg4',
    color: 'rgb(170, 87, 19)',
    light: '#aa57134d'
  },
  {
    name: 'color-bg5',
    color: 'rgb(189, 48, 40)',
    light: '#bd30284d'
  },
  {
    name: 'color-bg6',
    color: 'rgb(22, 120, 191)',
    light: '#1678bf4d'
  },
  {
    name: 'color-bg7',
    color: 'rgb(13, 147, 142)',
    light: '#0d938e4d'
  },
  {
    name: 'color-bg8',
    color: 'rgb(50, 57, 167)',
    light: '#3239a74d'
  }
]

const UnstopOpportunity = () => {
  const { opportunityId } = useParams()
  const [opportunity, setOpportunity] = useState({})
  const [loading, setLoading] = useState(true)
  const [themeColor, setThemeColor] = useState('blue')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    getRequest('opportunity/unstop/' + opportunityId)
      .then(res => {
        setOpportunity(JSON.parse(res.data.result).data.competition)
        setLoading(false)
        setThemeColor(
          themeColors.find(
            c =>
              c.name ===
              JSON.parse(res.data.result).data.competition.theme_colour
          ) || {
            name: 'blue',
            color: 'rgb(0, 115, 230)',
            light: '#0073e64d'
          }
        )
      })
      .catch(err => {
        console.log(err)
      })
  }, [opportunityId])

  console.log(opportunity)

  if (loading) return <div>Loading...</div>

  return (
    <div
      style={{
        position: 'relative',
        maxWidth: '1600px',
        width: '100%',
        margin: '0px auto',
        color: themeColor.color,
        backgroundColor: '#FFF'
      }}
    >
      {/* first */}
      <div style={{ position: 'relative', padding: 0 }}>
        <div>
          {/* banner */}
          {opportunity.all_banner.length ? (
            <Carousel autoplay>
              {opportunity.all_banner.map(item => (
                <Image preview={false} src={item.image_url} key={item.id} />
              ))}
            </Carousel>
          ) : (
            <div
              style={{
                background: `linear-gradient(270deg, ${themeColor.color} 0%, #FFFFFF 100%)`
              }}
            >
              <Image
                preview={false}
                src={opportunity.banner.image_url}
                onError={e => {
                  e.target.onerror = null
                  e.target.src =
                    'https://d8it4huxumps7.cloudfront.net/images/opportunity_banner/d2c-jobs/internships-01-left.svg'
                }}
              />
            </div>
          )}
          <div
            style={{
              borderTop: `3px solid ${themeColor.color}`,
              background: '#fff',
              position: 'relative',
              zIndex: 9,
              padding: '0px 60px'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '20px 0px',
                color: '#1c4980'
              }}
            >
              <div
                style={{
                  maxWidth: 'calc(100% - 300px)',
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: '10px',
                  padding: '10px 18px 10px 10px',
                  background: 'rgba(236,239,243,.5)',
                  gap: 35
                }}
              >
                <div style={{ display: 'flex', gap: 15, alignItems: 'center' }}>
                  <div
                    style={{
                      height: '32px',
                      width: '32px',
                      background: '#fff',
                      boxShadow: '0 1px 4px #54545426',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: themeColor.color,
                      fontSize: '20px'
                    }}
                  >
                    <FaCalendarAlt />
                  </div>
                  <div>
                    <span
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        fontSize: '12px'
                      }}
                    >
                      <strong style={{ fontSize: '14px' }}>
                        Registration Deadline
                      </strong>
                      {moment(opportunity.regnRequirements.end_regn_dt).format(
                        'MMM Do YYYY, h:mm:ss a'
                      )}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 15, alignItems: 'center' }}>
                  <div
                    style={{
                      height: '32px',
                      width: '32px',
                      background: '#fff',
                      boxShadow: '0 1px 4px #54545426',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: themeColor.color,
                      fontSize: '20px'
                    }}
                  >
                    <ImUsers />
                  </div>
                  <div>
                    <span
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        fontSize: '12px'
                      }}
                    >
                      <strong style={{ fontSize: '14px' }}>Team Size</strong>
                      {opportunity.regnRequirements.min_team_size &&
                      opportunity.regnRequirements.max_team_size === 1
                        ? 'Individual Participation'
                        : opportunity.regnRequirements.min_team_size ===
                          opportunity.regnRequirements.max_team_size
                        ? opportunity.regnRequirements.min_team_size +
                          ' Members'
                        : opportunity.regnRequirements.min_team_size +
                          ' - ' +
                          opportunity.regnRequirements.max_team_size +
                          ' members'}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 15, alignItems: 'center' }}>
                  <div
                    style={{
                      height: '32px',
                      width: '32px',
                      background: '#fff',
                      boxShadow: '0 1px 4px #54545426',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: themeColor.color,
                      fontSize: '20px'
                    }}
                  >
                    <BiRupee />
                  </div>
                  <div>
                    <span
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        fontSize: '12px'
                      }}
                    >
                      <strong style={{ fontSize: '14px' }}>
                        Free Registration
                      </strong>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 20
                }}
              >
                <div
                  style={{
                    width: '120px',
                    height: '120px',
                    display: 'flex',
                    borderRadius: '10px',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 6px 65px #27497d17',
                    padding: '10px'
                  }}
                >
                  <Image
                    preview={false}
                    src={
                      opportunity.logoUrl2
                        ? opportunity.logoUrl2
                        : opportunity.logoUrl
                    }
                  />
                </div>
                <div>
                  <h1 style={{ margin: 0, color: '#1c4980', fontSize: '22px' }}>
                    {opportunity.title}
                  </h1>
                  {opportunity.festival ? (
                    <h3>{opportunity.festival?.name}</h3>
                  ) : null}
                  <span
                    style={{
                      fontSize: '16px',
                      fontWeight: 500,
                      color: '#1c4980'
                    }}
                  >
                    {opportunity?.organisation?.name}
                  </span>
                  <h3
                    style={{
                      marginTop: 15,
                      display: 'flex',
                      gap: 10,
                      alignItems: 'center'
                    }}
                  >
                    <IoLocationOutline style={{ fontSize: '20px' }} />
                    {'Location'}
                    <span style={{ fontWeight: 400, color: '#1c4980' }}>
                      {opportunity.region === 'online'
                        ? 'online'
                        : opportunity.address_with_country_logo.address}
                    </span>
                  </h3>
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  width: '300px',
                  border: `1px solid ${themeColor.light}`,
                  borderRadius: '10px',
                  padding: '15px 5px'
                }}
              >
                <div style={{ textAlign: 'center' }}>
                  <Avatar.Group>
                    {opportunity?.players?.map((player, index) => (
                      <Avatar
                        src={
                          player?.user?.social_avatar || player?.user?.avatar
                        }
                        key={player?.id}
                      />
                    ))}
                  </Avatar.Group>
                  <div style={{ marginTop: '0.5rem' }}>
                    <span style={{ fontSize: '20px' }}>
                      <b> {opportunity?.players_count}</b>
                    </span>
                    <p style={{ margin: 0 }}>Registered</p>
                  </div>
                </div>
                <div></div>
              </div>
            </div>
            <div
              style={{
                background: 'rgba(236,239,243,.35)',
                padding: '9px 18px',
                borderRadius: '10px',
                marginTop: '20px'
              }}
            >
              <div
                style={{
                  height: '55px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <div
                    style={{
                      marginRight: '15px',
                      paddingRight: '15px',
                      borderRight: `2px solid ${themeColor?.light}`,
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <strong
                      style={{
                        fontWeight: 600,
                        color: themeColor?.color
                      }}
                    >
                      Start Date
                    </strong>
                    <span
                      style={{
                        marginTop: '5px',
                        fontWeight: 500,
                        color: '#27497db3'
                      }}
                    >
                      {moment(opportunity?.start_date).format(
                        'MMMM Do YYYY, h:mm a'
                      )}
                    </span>
                  </div>
                  <div
                    style={{
                      marginRight: '15px',
                      paddingRight: '15px',
                      borderRight: `2px solid ${themeColor?.light}`,
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <strong
                      style={{
                        fontWeight: 600,
                        color: themeColor?.color
                      }}
                    >
                      End Date
                    </strong>
                    <span
                      style={{
                        marginTop: '5px',
                        fontWeight: 500,
                        color: '#27497db3'
                      }}
                    >
                      {moment(opportunity?.end_date)?.format(
                        'MMMM Do YYYY, h:mm a'
                      )}
                    </span>
                  </div>
                </div>
                <div
                  className="opportunity-tags-first"
                  style={{
                    display: 'flex',
                    overflowX: 'hidden',
                    width: '55%'
                  }}
                >
                  {opportunity?.filters
                    ?.filter(fl => fl.type !== 'eligible')
                    ?.map(s => (
                      <Tag
                        color={themeColor?.color}
                        style={{
                          fontSize: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '4px'
                        }}
                        key={s.id}
                        icon={
                          s.icon_url ? (
                            <img
                              src={s.icon_url}
                              style={{ width: 22, marginRight: 5 }}
                            />
                          ) : null
                        }
                      >
                        {s?.name}
                      </Tag>
                    ))}
                </div>
              </div>
              <div
                style={{
                  height: '55px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div
                  style={{
                    width: 'calc(100% - 280px)',
                    display: 'flex',
                    fontSize: '15px'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      overflow: 'hidden'
                    }}
                  >
                    <strong
                      style={{
                        marginRight: '25px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 7,
                        color: '#1c4980',
                        fontSize: '13px'
                      }}
                    >
                      <FiUserCheck style={{ fontSize: '16px' }} /> Eligibility:
                    </strong>
                    <div
                      style={{
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        display: 'flex'
                      }}
                    >
                      {opportunity?.filters
                        ?.filter(fl => fl.type === 'eligible')
                        .map((filter, index) => (
                          <div
                            key={filter?.id}
                            style={{
                              fontSize: '13px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              position: 'relative',
                              fontWeight: 500,
                              marginRight: '25px',
                              color: themeColor?.color,
                              gap: 5
                            }}
                          >
                            <Badge color={themeColor.light} /> {filter.name}
                          </div>
                        ))}
                      {opportunity?.regnRequirements?.allowed_organisations
                        .length > 0 ? (
                        <div
                          style={{
                            fontSize: '13px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                            fontWeight: 500,
                            marginRight: '25px',
                            gap: 5,
                            color: '#1c4980',
                            cursor: 'pointer',
                            textDecoration: 'underline'
                          }}
                          onClick={() => {
                            setOpen(true)
                          }}
                        >
                          <Badge color={themeColor.light} /> eligible for
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* second */}
      <div
        style={{
          maxWidth: '1550px',
          display: 'flex',
          margin: '0px auto',
          width: '100%',
          marginTop: '40px'
        }}
      >
        <div
          style={{
            maxWidth: '1330px',
            width: '100%',
            margin: '0px auto'
          }}
        >
          {opportunity.rounds.length > 0 &&
          opportunity?.display_configs?.show_rounds &&
          opportunity?.display_configs?.show_rounds_data &&
          !opportunity?.rounds[0]?.is_hidden &&
          !opportunity?.rounds[0]?.is_inactive ? (
            <div
              style={{
                padding: '40px'
              }}
            >
              <div
                style={{
                  maxWidth: '1330px',
                  margin: '0px auto',
                  width: '100%'
                }}
              >
                <h2
                  style={{
                    borderLeft: `10px solid ${themeColor.color}`,
                    color: '#1c4980',
                    paddingLeft: 30,
                    fontSize: '20px',
                    margin: '30px 0px'
                  }}
                >
                  {opportunity.title + ': Stages and Timeline'}
                </h2>
                <div
                  className="unstop-rounds-container"
                  style={{ color: themeColor.color, maxWidth: '1250px' }}
                >
                  {opportunity.rounds.map(round =>
                    !round?.is_hidden && !round?.is_inactive ? (
                      <div
                        key={round.id}
                        style={{ color: themeColor.color }}
                        className="unstop-round-list"
                      >
                        <div
                          style={{
                            width: '36px',
                            height: '36px',
                            border: `5px solid ${themeColor.light}`,
                            color:
                              round?.status === 'LIVE'
                                ? '#FFF'
                                : themeColor.color,
                            borderRadius: '50px',
                            position: 'absolute',
                            left: '-12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '16px',
                            fontWeight: '600',
                            background:
                              round?.status === 'LIVE'
                                ? themeColor.color
                                : '#fff',
                            opacity: '.9',
                            top: '50%',
                            marginTop: '-18px',
                            animation: 'live1 2.4s ease-in-out infinite'
                          }}
                        >
                          <BsCircleFill />
                        </div>
                        <div
                          id={round?.id}
                          style={{
                            color: themeColor.color,
                            padding: '22px 30px',
                            marginBottom: '20px',
                            borderRadius: '20px',
                            transition: '.4s',
                            position: 'relative',
                            boxShadow: '0 6px 65px #27497d17',
                            background: '#fff',
                            border:
                              round?.status === 'LIVE'
                                ? `2px solid ${themeColor.light}`
                                : ''
                          }}
                          className={round?.status === 'LIVE' ? 'conic' : ''}
                        >
                          {round?.status === 'LIVE'
                            ? document
                                .getElementById(round?.id)
                                ?.style?.setProperty(
                                  '--color',
                                  themeColor.color
                                )
                            : ''}
                          <h3 style={{ fontSize: '18px' }}>
                            {round.details[0].title}
                          </h3>
                          <div
                            style={{
                              fontSize: '15px',
                              lineHeight: '26px',
                              color: '#1c4980',
                              margin: '10px 0 0',
                              wordBreak: 'break-word'
                            }}
                            dangerouslySetInnerHTML={{
                              __html: round.details[0].display_text
                            }}
                          ></div>
                          <div
                            style={{ marginTop: 25, display: 'flex', gap: 40 }}
                          >
                            <span>
                              <div
                                style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  justifyContent: 'center',
                                  color: '#1c4980'
                                }}
                              >
                                <strong>Start Date</strong>
                                {moment(round.details[0].start_date).format(
                                  'MMMM Do YYYY, h:mm a'
                                )}
                              </div>
                            </span>
                            <span>
                              <div
                                style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  justifyContent: 'center',
                                  color: '#1c4980'
                                }}
                              >
                                <strong>End Date</strong>
                                {moment(round.details[0].end_date).format(
                                  'MMMM Do YYYY, h:mm a'
                                )}
                              </div>
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : null
                  )}
                </div>
              </div>
            </div>
          ) : null}
          <div
            style={{
              padding: '40px',
              background: 'rgba(236,239,243,.2)'
            }}
          >
            <div
              style={{ maxWidth: '1330px', margin: '0px auto', width: '100%' }}
            >
              <h2
                style={{
                  borderLeft: `10px solid ${themeColor.color}`,
                  color: '#1c4980',
                  paddingLeft: 30,
                  fontSize: '20px',
                  margin: '30px 0px'
                }}
              >
                {'All that you need to know about ' + opportunity.title}
              </h2>
              <div
                className="unstop-details-container"
                style={{ borderColor: themeColor.color }}
                dangerouslySetInnerHTML={{ __html: opportunity.details }}
              ></div>
            </div>
          </div>
          <div
            style={{
              padding: '40px'
            }}
          >
            <div
              style={{ maxWidth: '1330px', margin: '0px auto', width: '100%' }}
            >
              <Row gutter={30}>
                {opportunity.datesToshow.length > 0 ? (
                  <Col
                    span={opportunity.datesToshow.length > 6 ? 24 : 12}
                    style={{ marginTop: 25 }}
                  >
                    <h2
                      style={{
                        borderLeft: `10px solid ${themeColor.color}`,
                        color: '#1c4980',
                        paddingLeft: 30,
                        fontSize: '20px',
                        margin: '30px 0px'
                      }}
                    >
                      What are the important dates & deadlines?
                    </h2>
                    <ul
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        margin: '-15px -43px'
                      }}
                    >
                      {opportunity.datesToshow.map(date => (
                        <li
                          key={date.id}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            margin: '15px 5px',
                            width: `calc(${
                              opportunity.datesToshow.length > 6
                                ? '33.33%'
                                : '50%'
                            } - 10px)`,
                            gap: 10
                          }}
                        >
                          <div
                            style={{
                              height: '32px',
                              width: '32px',
                              background: themeColor.light,
                              boxShadow: '0 1px 4px #54545426',
                              borderRadius: '4px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: themeColor.color,
                              fontSize: '20px'
                            }}
                          >
                            <FaCalendarAlt />
                          </div>
                          <div>
                            <span
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                fontSize: '12px',
                                color: '#27497dd9'
                              }}
                            >
                              <strong
                                style={{
                                  fontSize: '13px',
                                  display: 'block',
                                  color: '#1c4980',
                                  fontWeight: 500
                                }}
                              >
                                {date.title}
                              </strong>
                              {moment(date.important_date).format(
                                'MMM Do YYYY, h:mm:ss a'
                              )}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </Col>
                ) : null}

                {opportunity.contacts.length > 0 ? (
                  <Col
                    span={opportunity?.contacts?.length > 1 ? 24 : 12}
                    style={{ marginTop: 25 }}
                  >
                    <h2
                      style={{
                        borderLeft: `10px solid ${themeColor.color}`,
                        color: '#1c4980',
                        paddingLeft: 30,
                        fontSize: '20px',
                        margin: '30px 0px'
                      }}
                    >
                      Contact the organisers
                    </h2>
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        width: '100%',
                        justifyContent: 'space-between',
                        margin: '-15px 0px'
                      }}
                    >
                      {opportunity.contacts.map(contact => (
                        <div
                          hoverable
                          key={contact.id}
                          style={{
                            width:
                              opportunity?.contacts?.length > 1
                                ? 'calc(33.33% - 30px)'
                                : 'calc(50% - 30px)',
                            margin: '5px',
                            padding: '10px 20px',
                            border: '1px solid #ebebeb'
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 10
                            }}
                          >
                            <div
                              style={{
                                height: '32px',
                                width: '32px',
                                background: '#FFF',
                                boxShadow: '0 1px 4px #54545426',
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: themeColor.color,
                                fontSize: '20px'
                              }}
                            >
                              <FaUserAlt />
                            </div>
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                width: '100%'
                              }}
                            >
                              <h3>{contact.name}</h3>
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
                                    shadow: '0 1px 4px #54545426',
                                    borderRadius: '50%',
                                    height: '30px',
                                    width: '30px',
                                    background: themeColor.light,
                                    color: themeColor.color,
                                    justifyContent: 'center'
                                  }}
                                >
                                  <FaEnvelope />
                                </div>
                                <div
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    shadow: '0 1px 4px #54545426',
                                    borderRadius: '50%',
                                    height: '30px',
                                    width: '30px',
                                    background: themeColor.light,
                                    color: themeColor.color,
                                    justifyContent: 'center'
                                  }}
                                >
                                  <FaPhoneAlt />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Col>
                ) : null}

                {opportunity.attachment.length > 0 ? (
                  <Col span={12} style={{ marginTop: 25 }}>
                    <h2
                      style={{
                        borderLeft: `10px solid ${themeColor.color}`,
                        color: '#1c4980',
                        paddingLeft: 30,
                        fontSize: '20px',
                        margin: '30px 0px'
                      }}
                    >
                      Download attachments
                    </h2>
                    <ul
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        margin: '-15px -40px'
                      }}
                    >
                      {opportunity.attachment.map(res => (
                        <li
                          key={res.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            margin: '5px',
                            width: 'calc(50% - 10px)',
                            gap: 10,
                            padding: '10px 20px',
                            border: '1px solid #ebebeb'
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              gap: 10,
                              alignItems: 'center'
                            }}
                          >
                            <div
                              style={{
                                height: '32px',
                                width: '32px',
                                background: themeColor.light,
                                boxShadow: '0 1px 4px #54545426',
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: themeColor.color,
                                fontSize: '20px'
                              }}
                            >
                              <AiOutlineFileImage />
                            </div>
                            <span>{res.title}</span>
                          </div>
                          <ImDownload3
                            style={{
                              fontSize: '20px',
                              color: themeColor.color
                            }}
                          />
                        </li>
                      ))}
                    </ul>
                  </Col>
                ) : null}
              </Row>
            </div>
          </div>
          {opportunity?.job_detail ? (
            <div
              style={{
                padding: '40px',
                background: 'rgba(236,239,243,.2)'
              }}
            >
              <div
                style={{
                  maxWidth: '1330px',
                  margin: '0px auto',
                  width: '100%'
                }}
              >
                <h2
                  style={{
                    borderLeft: `10px solid ${themeColor.color}`,
                    color: '#1c4980',
                    paddingLeft: 30,
                    fontSize: '20px',
                    margin: '30px 0px'
                  }}
                >
                  Additional Information
                </h2>
                <div
                  style={{
                    marginTop: 30,
                    padding: 0,
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between'
                  }}
                >
                  {[
                    {
                      item: 'Job Location(s)',
                      keys: [{ key: 'locations', abrivation: 'Locations' }]
                    },
                    {
                      item: 'Salary',
                      keys: [
                        { key: 'min_salary', abrivation: 'Min Salary' },
                        { key: 'max_salary', abrivation: 'Max Salary' }
                      ]
                    },
                    {
                      item: 'Job Type/Timing',
                      keys: [
                        { key: 'type', abrivation: 'Job Type' },
                        { key: 'timing', abrivation: 'Job Timing' }
                      ]
                    },
                    {
                      item: 'Experience',
                      keys: [
                        {
                          key: 'min_experience',
                          abrivation: 'Min Experience'
                        },
                        {
                          key: 'max_experience',
                          abrivation: 'Max Experience'
                        }
                      ]
                    },
                    {
                      item: 'Work Detail',
                      keys: [
                        { key: 'working_days', abrivation: 'Working Days' },
                        {
                          key: 'working_hours',
                          abrivation: 'Working Hours'
                        }
                      ]
                    }
                  ]
                    .map(s => {
                      return {
                        item: s.item,
                        keys: s.keys.filter(key => {
                          return (
                            opportunity.job_detail[key.key] !== undefined &&
                            opportunity.job_detail[key.key] !== null &&
                            opportunity.job_detail[key.key] !== ''
                          )
                        })
                      }
                    })

                    .map((ai, index) =>
                      ai?.keys?.length > 0 ? (
                        <div
                          style={{
                            width: 'calc(50% - 30px)',
                            margin: '30px 10px',
                            position: 'relative',
                            flexDirection: 'row',
                            alignItems: 'center',
                            minHeight: 'auto',
                            paddingBottom: '20px',
                            overflow: 'hidden',
                            boxShadow: '0.67px 3.67px 8px #186edf3b',
                            borderRadius: '13px',
                            padding: '20px 20px 10px',
                            display: 'flex',
                            background: '#fff',
                            justifyContent: 'space-between'
                          }}
                          key={index}
                        >
                          <div
                            style={{
                              width: 'calc(100% - 80px)',
                              paddingRight: '40px'
                            }}
                          >
                            <h3
                              style={{
                                fontSize: '17px',
                                lineHeight: '21px',
                                marginBottom: '15px',
                                color: themeColor.color,
                                fontWeight: 600
                              }}
                            >
                              {ai.item}
                            </h3>
                            {ai.keys.map((keyItem, index) =>
                              opportunity?.job_detail?.[keyItem.key] !==
                              null ? (
                                <p
                                  key={index}
                                  style={{
                                    fontSize: '14px',
                                    lineHeight: '19px',
                                    fontWeight: 400,
                                    margin: 0,
                                    padding: 0,
                                    color: '#1c4980',
                                    marginBottom: '7px'
                                  }}
                                >
                                  <strong>{keyItem.abrivation}: </strong>
                                  {opportunity?.job_detail?.[keyItem.key] ===
                                  'in_office'
                                    ? 'In Office'
                                    : opportunity?.job_detail?.[keyItem.key]}
                                </p>
                              ) : null
                            )}
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              height: '100px'
                            }}
                          >
                            <img
                              alt="some icon image"
                              src={
                                ai.item === 'Job Location(s)'
                                  ? 'https://d8it4huxumps7.cloudfront.net/uploads/images/unstop/stipend/location.svg'
                                  : ai.item === 'Salary'
                                  ? 'https://d8it4huxumps7.cloudfront.net/uploads/images/unstop/stipend/salary.svg'
                                  : ai.item === 'Job Type/Timing'
                                  ? 'https://d8it4huxumps7.cloudfront.net/uploads/images/unstop/stipend/job-timing.svg'
                                  : ai.item === 'Experience'
                                  ? 'https://d8it4huxumps7.cloudfront.net/uploads/images/unstop/stipend/experience.svg'
                                  : 'https://d8it4huxumps7.cloudfront.net/uploads/images/unstop/stipend/work-detail.svg'
                              }
                            />
                          </div>
                        </div>
                      ) : null
                    )}
                </div>
              </div>
            </div>
          ) : null}
          {opportunity?.subtype !== 'jobs' ? (
            <div
              style={{
                padding: '40px',
                background: 'rgba(236,239,243,.2)'
              }}
            >
              <div
                style={{
                  maxWidth: '1330px',
                  margin: '0px auto',
                  width: '100%'
                }}
              >
                <h2
                  style={{
                    borderLeft: `10px solid ${themeColor.color}`,
                    color: '#1c4980',
                    paddingLeft: 30,
                    fontSize: '20px'
                  }}
                >
                  Rewards and Prizes
                </h2>
                {opportunity?.overall_prizes ? (
                  <p
                    style={{
                      fontSize: '14px',
                      paddingLeft: 40,
                      fontWeight: 500
                    }}
                  >
                    {opportunity?.overall_prizes}
                  </p>
                ) : null}
                <div
                  style={{
                    marginTop: 30,
                    padding: 0,
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center'
                  }}
                >
                  {opportunity.prizes.map(reward => (
                    <div
                      style={{
                        width: 'calc(33.33% - 20px)',
                        margin: '10px',
                        position: 'relative'
                      }}
                      key={reward.id}
                    >
                      <Badge.Ribbon
                        text={
                          reward.certificate
                            ? 'certificate'
                            : reward.pre_placement_internship
                            ? `PPI's`
                            : reward.pre_placement_opportunity
                            ? `PPO's`
                            : ''
                        }
                        color={
                          reward.pre_placement_internship ||
                          reward.pre_placement_opportunity
                            ? 'pink'
                            : 'green'
                        }
                        key={reward.id}
                        style={{
                          display:
                            reward.certificate ||
                            reward.pre_placement_internship ||
                            reward.pre_placement_opportunity
                              ? 'block'
                              : 'none'
                        }}
                      >
                        <div
                          style={{
                            overflow: 'hidden',
                            background: '#ffffff',
                            boxShadow: '0.67px 3.67px 8px #186edf3b',
                            borderRadius: '13px',
                            padding: '20px 20px 10px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            minHeight: '180px',
                            color: '#1c4980'
                          }}
                        >
                          <div style={{ paddingRight: '70px' }}>
                            <h3 style={{ fontSize: '18px' }}>{reward.rank}</h3>
                            <p
                              style={{
                                fontSize: '12px',
                                margin: '12px 0 0',
                                lineHeight: '18px'
                              }}
                            >
                              {reward.others}
                            </p>
                          </div>
                          {reward.cash ? (
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                height: '80px',
                                color: themeColor.color,
                                fontSize: '20px',
                                fontWeight: '500'
                              }}
                            >
                              <strong>
                                {reward.cash.toLocaleString('en-US', {
                                  style: 'currency',
                                  currency: reward.currencyCode
                                })}
                              </strong>
                            </div>
                          ) : null}

                          <img
                            style={{
                              display: 'block',
                              width: '60px',
                              height: 'auto',
                              position: 'absolute',
                              right: '10px',
                              bottom: '10px'
                            }}
                            alt="logo"
                            src={
                              reward.pre_placement_internship ||
                              reward.pre_placement_opportunity
                                ? 'https://d8it4huxumps7.cloudfront.net/uploads/images/svg-images/ppi-icon.png'
                                : 'https://d8it4huxumps7.cloudfront.net/uploads/images/svg-images/unstop-trophy.png'
                            }
                          />
                        </div>
                      </Badge.Ribbon>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
          {opportunity?.gallery?.length > 0 ? (
            <div
              style={{
                padding: '40px'
              }}
            >
              <div
                style={{
                  maxWidth: '1330px',
                  margin: '0px auto',
                  width: '100%'
                }}
              >
                <h2
                  style={{
                    borderLeft: `10px solid ${themeColor.color}`,
                    color: '#1c4980',
                    paddingLeft: 30,
                    fontSize: '20px',
                    marginBottom: '30px'
                  }}
                >
                  In Pictures
                </h2>
                <div>
                  <Image.PreviewGroup>
                    <Carousel slidesPerRow={4}>
                      {opportunity?.gallery?.map((res, index) => (
                        <div key={index}>
                          <div
                            style={{
                              position: 'relative',
                              height: '16rem',
                              width: '100%',
                              justifyContent: 'center',
                              alignItems: 'center',
                              display: 'flex',
                              padding: '15px'
                            }}
                          >
                            <Image
                              alt="logo"
                              height={200}
                              src={res?.image_url}
                            />
                          </div>
                        </div>
                      ))}
                    </Carousel>
                  </Image.PreviewGroup>
                </div>
              </div>
            </div>
          ) : null}

          <div
            style={{
              border: `2px solid ${themeColor.color}`,
              padding: '20px',
              margin: '50px',
              borderRadius: '7px'
            }}
          >
            <h1
              style={{
                color: '#1c4980'
              }}
            >
              {opportunity?.organisation?.name}
            </h1>
            <a
              href={opportunity?.organisation?.seo_url}
              style={{
                textDecoration: 'none'
              }}
              target="_blank"
            >
              <div
                style={{
                  color: '#1c4980',
                  fontSize: '16px',
                  cursor: 'pointer'
                }}
                dangerouslySetInnerHTML={{
                  __html:
                    opportunity?.organisation?.description?.slice(0, 850) +
                    '...'
                }}
              ></div>
              <Button
                type="primary"
                size="large"
                style={{
                  background: themeColor.color
                }}
              >
                {' '}
                Read more & get a sneak-peek into{' '}
                {opportunity?.organisation?.name}
              </Button>
            </a>
          </div>
        </div>
      </div>
      {opportunity?.regnRequirements?.allowed_organisations?.length > 0 ? (
        <Drawer
          title="Eligible Institutes/Organizations"
          placement="right"
          onClose={() => setOpen(false)}
          open={open}
          bodyStyle={{ padding: 5 }}
          width={500}
        >
          {opportunity?.regnRequirements?.allowed_organisations?.map(
            (res, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '20px 10px',
                  borderBottom: '1px solid #e8e8e8',
                  gap: 15
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100px',
                    padding: '5px',
                    borderRadius: '5px',
                    position: 'relative',
                    boxShadow: '0 1px 4px #54545426',
                    minWidth: '100px'
                  }}
                >
                  <Image preview={false} src={res?.logoUrl2} />
                </div>
                <p
                  style={{
                    fontWeight: '500',
                    color: themeColor?.color
                  }}
                >
                  {res?.name}
                </p>
              </div>
            )
          )}
        </Drawer>
      ) : null}
    </div>
  )
}

export default UnstopOpportunity
