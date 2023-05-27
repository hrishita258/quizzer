import {
  Card,
  Checkbox,
  Col,
  Collapse,
  Image,
  Input,
  Rate,
  Row,
  Tag,
  Tree
} from 'antd'
import React, { useEffect, useState } from 'react'
import { getRequest } from '../axios/axiosMethods'
import PageLayout from '../components/PageLayout'
import filters from '../data/openseasme.json'

const BREADCRUMBS = [
  {
    name: 'Home',
    link: {
      route: '/',
      key: 1
    }
  },
  {
    name: 'Edx'
  }
]

const filterKeys = {
  publishersFacet: 'Publishers',
  ratingsRanges: 'Rating',
  durationRanges: 'Seat Time',
  featuresFacet: 'Features',
  languages: 'Languages',
  accreditationFacet: 'Accreditation Organizations',
  priceRanges: 'Price',
  productType: 'Product Type',
  categoriesFacet: 'Category'
}

const Edx = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedFilters, setSelectedFilters] = useState([])

  const fetchData = async () => {
    setLoading(true)
    try {
      getRequest('opportunity/openseasme').then(json => {
        setData(json.data.result.results)
      })
    } catch (error) {
      console.log(error)
      setError(error)
    } finally {
      setLoading(false)
    }
  }

  const TreeTitle = ({ name, count }) => (
    <div
      key={name}
      style={{
        display: 'flex',
        justifyContent: 'space-between'
      }}
    >
      <h4 style={{ fontSize: '14px', color: '#555', fontWeight: 600 }}>
        {name}
      </h4>
      <span style={{ fontSize: '12px', color: '#555', fontWeight: 600 }}>
        {count}
      </span>
    </div>
  )

  useEffect(() => {
    fetchData()
  }, [])

  console.log(data)

  const onFilterSelectionChange = (filterKey, id) => {
    let selectedFilter = selectedFilters?.find(f => f.filterKey === filterKey)

    if (selectedFilter) {
      // If the filter already exists, add or remove the id from selectedIds
      if (selectedFilter.selectedIds.includes(id)) {
        selectedFilter.selectedIds = selectedFilter.selectedIds.filter(
          i => i !== id
        )
      } else {
        selectedFilter.selectedIds.push(id)
      }
    } else {
      // If the filter does not exist, add it to selectedFilters
      selectedFilter = { filterKey, selectedIds: [id] }
      selectedFilters.push(selectedFilter)
    }

    setSelectedFilters([...selectedFilters])
  }

  if (error) return 'Error!'
  if (!data) return null
  console.log(selectedFilters)
  return (
    <PageLayout breadcrumbs={BREADCRUMBS} loading={loading}>
      <Row
        style={{
          position: 'relative'
        }}
        gutter={15}
      >
        <Col
          xs={0}
          md={8}
          lg={8}
          xl={6}
          xxl={5}
          style={{
            height: 'calc(100vh - 50px)',
            position: 'sticky',
            top: '70px',
            overflowY: 'auto',
            overflowX: 'hidden',
            borderRight: '2px solid #e8e8e8',
            backgroundColor: '#fff'
          }}
        >
          <div style={{ width: '99%' }}>
            <Collapse
              defaultActiveKey={['categoriesFacet', 'productType']}
              ghost
              expandIconPosition="end"
              style={{ padding: 0 }}
              bodyStyle={{ padding: 0 }}
              bordered
            >
              {Object.keys(filters?.facetValues)
                .reverse()
                .map(
                  (filter, index) =>
                    filterKeys[filter] && (
                      <Collapse.Panel
                        style={{
                          padding: '0px',
                          borderBottom: '1px solid #e8e8e8'
                        }}
                        bodyStyle={{ padding: '0px' }}
                        className="site-collapse-custom-panel"
                        header={
                          <h2
                            style={{
                              fontSize: '14px',
                              fontWeight: '600',
                              color: '#555'
                            }}
                          >
                            {filterKeys[filter]}
                          </h2>
                        }
                        key={filter}
                      >
                        {filter === 'categoriesFacet' ? (
                          <Tree
                            checkable
                            onCheck={c => setSelectedFilters(filter, c)}
                            treeData={filters.facetValues[
                              'categoriesFacet'
                            ]?.map(s => ({
                              title: (
                                <TreeTitle name={s.name} count={s.count} />
                              ),
                              key: s.id,
                              children: s.children?.map(c => ({
                                title: (
                                  <TreeTitle name={c.name} count={c.count} />
                                ),
                                key: c.id,
                                children: c.children?.map(b => ({
                                  title: (
                                    <TreeTitle name={b.name} count={b.count} />
                                  ),
                                  key: b.id,
                                  children: b.children?.map(d => ({
                                    title: (
                                      <TreeTitle
                                        name={d.name}
                                        count={d.count}
                                      />
                                    ),
                                    key: d.id
                                  }))
                                }))
                              }))
                            }))}
                          />
                        ) : (
                          <div key={filter}>
                            <Input
                              placeholder={`Filter ${filterKeys[filter]}`}
                              style={{ marginBottom: '10px' }}
                            />
                            {filters.facetValues[filter]?.map(s => (
                              <div
                                style={{
                                  width: '100%',
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center'
                                }}
                                key={s.id}
                              >
                                <Checkbox
                                  style={{ width: '85%' }}
                                  onChange={() =>
                                    onFilterSelectionChange(
                                      filter,
                                      s.id ? s.id : s.name
                                    )
                                  }
                                >
                                  <h4
                                    style={{
                                      fontSize: '14px',
                                      color: '#555',
                                      fontWeight: 600
                                    }}
                                  >
                                    {s.name}
                                  </h4>
                                </Checkbox>
                                <span
                                  style={{
                                    fontSize: '12px',
                                    color: '#555',
                                    fontWeight: 600
                                  }}
                                >
                                  {s.count}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </Collapse.Panel>
                    )
                )}
            </Collapse>
          </div>
        </Col>
        <Col xs={0} md={8} lg={16} xl={18} xxl={19}>
          <Row gutter={15} style={{ marginLeft: '10px' }}>
            {data?.map(item => (
              <Col xs={24} sm={12} md={12} lg={12} xl={8} xxl={6} key={item.id}>
                <Card
                  cover={
                    <div
                      style={{
                        position: 'relative',
                        display: 'flex',
                        justifyContent: 'center'
                      }}
                    >
                      <Image
                        alt={item.title}
                        src={item.imagePath}
                        style={{
                          padding: '0.7rem',
                          height: '220px',
                          width: '100%'
                        }}
                        preview={false}
                      />
                    </div>
                  }
                  bodyStyle={{
                    position: 'relative',
                    padding: '0px 15px 25px 15px'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      gap: 10,
                      alignItems: 'center',
                      width: '100%',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <Rate
                        allowHalf
                        defaultValue={Math.ceil(item.ratingCount / 20)}
                      />
                      <small>({item.ratingCount})</small>
                    </div>
                    <span>
                      <b>{item.durationMinutes} Min</b>
                    </span>
                  </div>
                  <Card.Meta
                    title={item.title}
                    description={item.publishedByUser.displayName}
                  />
                  <div style={{ display: 'flex', marginTop: '20px' }}>
                    {item.isOpenSesameExclusive ? (
                      <Tag color="orange">Exclusive</Tag>
                    ) : null}
                    {item.isPlus ? <Tag color="green">Plus</Tag> : null}
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </PageLayout>
  )
}

export default Edx
