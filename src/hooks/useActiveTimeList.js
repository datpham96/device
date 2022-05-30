import {useState, useEffect} from 'react';
const DATA_TIME_LIST = [
  {
    id: 1,
    day: 2,
    dayName: 'Thứ 2',
    startTime: '',
    endTime: '',
  },
  {
    id: 2,
    day: 3,
    dayName: 'Thứ 3',
    startTime: '',
    endTime: '',
  },
  {
    id: 3,
    day: 4,
    dayName: 'Thứ 4',
    startTime: '',
    endTime: '',
  },
  {
    id: 4,
    day: 5,
    dayName: 'Thứ 5',
    startTime: '',
    endTime: '',
  },
  {
    id: 5,
    day: 6,
    dayName: 'Thứ 6',
    startTime: '',
    endTime: '',
  },
  {
    id: 6,
    day: 7,
    dayName: 'Thứ 7',
    startTime: '',
    endTime: '',
  },
  {
    id: 7,
    day: 8,
    dayName: 'CN',
    startTime: '',
    endTime: '',
  },
];
const HOURS_DEFAULT = '00';
const MINUTE_DEFAULT = '00';
const TIME_DEFAULT = '00/00';

const useActiveTimeList = (list, visible, isRefetching) => {
  const [timeList, setTimeList] = useState(DATA_TIME_LIST);

  //set time list by active item list
  useEffect(() => {
    if (list && list?.timer?.length > 0) {
      let tmpTimeList = list?.timer?.map((item, key) => {
        let tmpStartTime = item?.start_time;
        let tmpEndTime = item?.end_time;
        if (tmpStartTime || tmpEndTime) {
          let tmpHoursStartTime = tmpStartTime
            ? tmpStartTime?.split(':')[0]
            : HOURS_DEFAULT;
          let tmpHoursEndTime = tmpEndTime
            ? tmpEndTime?.split(':')[0]
            : HOURS_DEFAULT;
          let tmpMinuteStartTime = tmpStartTime
            ? tmpStartTime?.split(':')[1]
            : MINUTE_DEFAULT;
          let tmpMinuteEndTime = tmpEndTime
            ? tmpEndTime?.split(':')[1]
            : MINUTE_DEFAULT;
          return {
            ...item,
            day: key + 2,
            dayName: key + 2 === 8 ? 'CN' : 'Thứ ' + (key + 2),
            startTime: tmpStartTime
              ? tmpHoursStartTime + ':' + tmpMinuteStartTime
              : TIME_DEFAULT,
            endTime: tmpEndTime
              ? tmpHoursEndTime + ':' + tmpMinuteEndTime
              : TIME_DEFAULT,
          };
        } else {
          return {
            ...item,
            day: key + 2,
            dayName: key + 2 === 8 ? 'CN' : 'Thứ ' + (key + 2),
            startTime: '',
            endTime: '',
          };
        }
      });
      setTimeList(tmpTimeList);
    }
  }, [list, visible, isRefetching]);
  return [timeList, setTimeList];
};

export default useActiveTimeList;
