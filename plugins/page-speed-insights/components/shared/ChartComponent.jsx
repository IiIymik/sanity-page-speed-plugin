import React, {useCallback, useState, useRef} from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import {Bar, Line} from 'react-chartjs-2'
import {CATEGORIES} from '../../helpers/constants'
import {filterDates, random_rgba} from '../../helpers/functions'
import {DatePickerComponentMemo} from './DatePickerComponent'
import {Checkbox, Flex, Text, Box, Heading} from '@sanity/ui'
import styled from 'styled-components'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement
)

const OptionTitle = styled.h2`
  font-weight: 600;
  font-size: 16px;
  line-height: 1.5;

  display: flex;
  align-items: center;
  color: #003e56;
  margin: 0;
`
const COLORS_BAR = [
  'rgb(59, 130, 162)',
  'rgb(239, 202, 112)',
  'rgb(106, 79, 121)',
  'rgb(72, 137, 88)',
  'rgb(225, 96, 68)',
]
const ChartComponent = ({history}) => {
  const chartRef = useRef(null)
  const [value, onChange] = useState(null)
  const [isCheckedList, setIsCheckedList] = useState([])
  const labelList = Boolean(history?.length) ? [...history.map((dateReq) => dateReq[0])] : []
  const dataSetList = Boolean(history?.length)
    ? [
        ...CATEGORIES.map((category, idx) => {
          return {
            label: category,
            data: [...history.map((it) => it[idx + 1])],
            backgroundColor: COLORS_BAR[idx],
          }
        }),
      ]
    : []

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        display: false,
      },
      title: {
        display: false,
        text: 'Request History',
      },
    },
  }
  const renderDatePickerComponent = useCallback(() => {
    return <DatePickerComponentMemo value={value} onChange={onChange} />
  }, [value])

  const renderCustomCheckBox = useCallback(() => {
    const updateChart = (target, chart, name) => {
      const {value} = target
      const isDataShow = chart.isDatasetVisible(value)

      if (isDataShow === false) {
        chart.show(value)
        setIsCheckedList((prev) => prev.filter((it) => it !== name))
      }
      if (isDataShow === true) {
        chart.hide(value)
        setIsCheckedList([...isCheckedList, name])
      }
    }

    return CATEGORIES.map((item, idx) => {
      return (
        <Flex key={`${item}-${idx}`} align="center" gap={1}>
          <Checkbox
            value={idx}
            checked={!Boolean(isCheckedList?.includes(item))}
            onChange={({target}) => updateChart(target, chartRef.current, item)}
          />
          <OptionTitle>{item.replace('_', ' ')}</OptionTitle>
        </Flex>
      )
    })
  }, [isCheckedList])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        he: '100%',
      }}
    >
      <Flex align={'center'} gap={2} justify={'flex-end'} padding={2}>
        {renderDatePickerComponent()}
      </Flex>
      <Flex justify={'center'} padding={2}>
        <Heading as="h3" size={1}>
          Request History
        </Heading>
      </Flex>
      <Flex align={'center'} gap={2} justify={'center'} padding={1}>
        {renderCustomCheckBox()}
      </Flex>
      <Bar
        options={options}
        data={{
          labels: value ? filterDates(labelList, value[0], value[1]) : labelList,
          datasets: dataSetList,
        }}
        ref={chartRef}
      />
      {/* <Line
        options={options}
        data={{
          labels: value ? filterDates(labelList, value[0], value[1]) : labelList,
          datasets: dataSetList,
        }}
        ref={chartRef}
      /> */}
    </div>
  )
}

export const ChartComponentMemo = React.memo(ChartComponent)