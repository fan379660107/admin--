/*
* 统计里通用的一行多个预览模块
* data：要渲染的数据
* getMemberPreviewData：点击昨天、近7天、近30天更新数据的方法
* @zjf-2021-07-06
* */
import { connect } from 'dva/index';
import moment from 'moment';
import React, { Component } from 'react';
import { Form } from 'antd';
import {
  sldSvgIcon, formatNum,
} from '@/utils/utils';
import global from '@/global.less';
import stat from '@/assets/css/stat.less';
import TweenOne from 'rc-tween-one';
import Children from 'rc-tween-one/lib/plugin/ChildrenPlugin';

TweenOne.plugins.push(Children);
@connect(({ statistics }) => ({
  statistics,
}))
@Form.create()

export default class OverView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      overViewData: props.data,
      headerModuleLoadingStatus: false,
      selectData: [
        '昨天', '近7天', '近30天',
      ],
      paramsOptions: [
        {
          startTime: (moment().subtract(1, 'days').format('YYYY-MM-DD') + ' 00:00:00'),
          endTime: (moment().subtract(1, 'days').format('YYYY-MM-DD') + ' 23:59:59:999'),
        },
        {
          startTime: (moment().subtract(7, 'days').format('YYYY-MM-DD') + ' 00:00:00'),
          endTime: (moment().subtract(1, 'days').format('YYYY-MM-DD') + ' 23:59:59:999'),
        },
        {
          startTime: (moment().subtract(30, 'days').format('YYYY-MM-DD') + ' 00:00:00'),
          endTime: (moment().subtract(1, 'days').format('YYYY-MM-DD') + ' 23:59:59:999'),
        },
      ],
      statItemCurrentDayIndex: [0, 0, 0, 0, 0],
      daySelectModalStatus: false,
      tabItem: props.tabItem || 4,
    };
  };

  componentDidMount() {
    //body内的点击事件会hide select-modal
    document.body.addEventListener('click', this.hideCurrentDayModal);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (JSON.stringify(nextProps.data) != JSON.stringify(this.props.data)) {
      this.setState({ overViewData: nextProps.data });
    }
  }

  componentWillUnmount() {
    document.body.removeEventListener('click', this.hideCurrentDayModal);
  }

  dayChange(e) {
    const { statItemCurrentDayIndex, paramsOptions } = this.state;
    statItemCurrentDayIndex[e.itemIndex] = e.optionIndex;
    this.setState({
      statItemCurrentDayIndex,
      daySelectModalStatus: false,
    }, () => {
      this.props.getMemberPreviewData(e.itemIndex - 1, paramsOptions[e.optionIndex]);
    });
  }

  showCurrentDayModal(e, index) {
    e.stopPropagation();
    this.setState({
      daySelectModalStatus: index,
    });
  }

  hideCurrentDayModal = () => {
    let {daySelectModalStatus} = this.state;
    if(daySelectModalStatus){
      this.setState({
        daySelectModalStatus: false,
      });
    }
  }

  render() {
    const { selectData, statItemCurrentDayIndex, daySelectModalStatus, overViewData, tabItem } = this.state;
    return (
      <div className={`${stat.colorful_store_item}`}>
        <ul className={`${global.flex_row_between_center}`}>
          {
            overViewData.map((item, index) => (
              <li style={{ backgroundImage: `url(${item.bg})`, width: `${100 / tabItem - 1}%` }}>
                <div className={`${stat.up_title} ${global.flex_row_between_center}`}>
                  <div className={`${stat.left_label}`}>{item.name}</div>
                  {
                    item.isShowOperate ?
                      <div className={`${stat.right_operate} `}>
                        <fragment className={`${global.flex_row_start_center}`}
                                  onClick={(e) => this.showCurrentDayModal(e, index)}>
                          <span>{selectData[statItemCurrentDayIndex[index]]}</span><i
                          className={`${daySelectModalStatus === index ? stat.open : ''}`}></i></fragment>
                        <div
                          className={`${stat.select_modal} ${daySelectModalStatus === index ? '' : stat.hide}`}>
                          {selectData.map((item2, index2) => (
                            <div onClick={(e) => this.dayChange({ optionIndex: index2, itemIndex: index })}
                                 className={`${stat.select_option} ${statItemCurrentDayIndex[index] === index2 ? stat.current : ''}`}>{item2}{statItemCurrentDayIndex[index] === index2 ? sldSvgIcon('#FF5000', 16, 16, 'xuanzhong1') : ''}</div>
                          ))}
                        </div>
                      </div> : <div></div>
                  }
                </div>
                <div className={`${stat.number}`} title={item.num}>
                  {item.num > 10000
                      ? formatNum(item.num,0,'#fff')
                      : <TweenOne animation={{
                        Children: {
                          value: item.num, floatLength: 0,
                          formatMoney: true,
                        },
                        duration: 1000,
                      }}/>
                  }
                </div>
                {item.isDifferenceShow ? <div className={`${stat.down_desc}`}>
                  <span className={`${stat.intro}`}>较上期&nbsp;&nbsp;</span>
                  <span
                    className={`${stat.difference}`}>{parseFloat(item.differenceNum) === 0 ? '--' : item.differenceNum}</span>
                  {parseFloat(item.differenceNum) === 0 ? '' :
                    <i>{sldSvgIcon('#ffffff', 16, 16, item.differenceNum.indexOf('-') === 0 ? 'xiajiang' : 'shangsheng')}</i>}

                </div> : ''}
              </li>
            ))
          }
        </ul>
      </div>
    );
  }
}
