import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form } from 'antd';
import {
  sldComLanguage,
} from '@/utils/utils';
import CommonActivityList from './common_activity_list';
@connect(({ draw }) => ({
  draw,
}))
@Form.create()
export default class LuckyList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
  }

  render() {
    return (
      <CommonActivityList drawType={1} pageTitle={`${sldComLanguage('幸运抽奖')}`}/>
    );
  }
}
