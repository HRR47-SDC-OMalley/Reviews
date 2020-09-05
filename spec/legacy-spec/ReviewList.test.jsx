/* eslint no-undef: 0 */

import { mount, shallow, configure } from 'enzyme';
import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import ReviewList, { Styled, Arrow } from '../client/ReviewList.jsx';
import dummyData from './dummyData.js';

configure({ adapter: new Adapter() });

describe('ReviewList - Basics', () => {
  it('has a properly formatted state component', () => {
    const wrapper = shallow(<ReviewList />);
    const instance = wrapper.instance();
    expect(instance.state.reviews).toEqual([]);
    expect(instance.state.rating).toEqual(0);
    expect(instance.state.isShowingReviews).toEqual(false);
  });
});

describe('ReviewList - State', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(<ReviewList />);
    wrapper.setState({
      reviews: dummyData.sample1,
      rating: dummyData.sample1AverageRating
    });
  });

  it('displays reviews that are stored within its state', () => {
    wrapper.setState({
      isShowingReviews: true
    });
    expect(wrapper.find(Styled.Review)).toHaveLength(4);
  });

  it('keeps an average rating of all of the seller\'s reviews', () => {
    let averageRating = 0;
    for (let i = 0; i < wrapper.state('reviews').length; i += 1) {
      averageRating += wrapper.state('reviews')[i].rating;
    }
    averageRating /= wrapper.state('reviews').length;
    expect(wrapper.state('rating')).toBe(averageRating);
  });

  it('only displays reviews when the Style.Toggle component is clicked', () => {
    expect(wrapper.find(Styled.Review)).toHaveLength(0);
    wrapper.find(Styled.Toggle).simulate('click');
    expect(wrapper.find(Styled.Review)).toHaveLength(4);
  });

  it('does not display reviews when the Style.Toggle component is clicked twice', () => {
    expect(wrapper.find(Styled.Review)).toHaveLength(0);
    wrapper.find(Styled.Toggle).simulate('click');
    expect(wrapper.find(Styled.Review)).toHaveLength(4);
    wrapper.find(Styled.Toggle).simulate('click');
    expect(wrapper.find(Styled.Review)).toHaveLength(0);
  });

  it('only displays the five most recent reviews', () => {
    wrapper.setState({
      reviews: dummyData.sample2,
      rating: dummyData.sample2AverageRating
    });
    expect(dummyData.sample2).toHaveLength(8);
    wrapper.find(Styled.Toggle).simulate('click');
    expect(wrapper.find(Styled.Review)).toHaveLength(5);
  });
});

describe('ReviewList - Styled Arrow', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(<ReviewList />);
    wrapper.setState({
      reviews: dummyData.sample1,
      rating: dummyData.sample1AverageRating
    });
  });

  it('should display DownArrow when isShowingReviews is false', () => {
    expect(wrapper.state('isShowingReviews')).toEqual(false);
    expect(wrapper.find(Arrow.DownArrow)).toHaveLength(1);
    expect(wrapper.find(Arrow.UpArrow)).toHaveLength(0);
  });

  it('should display UpArrow when isShowingReviews is true', () => {
    wrapper.find(Styled.Toggle).simulate('click');
    expect(wrapper.state('isShowingReviews')).toEqual(true);
    expect(wrapper.find(Arrow.UpArrow)).toHaveLength(1);
    expect(wrapper.find(Arrow.DownArrow)).toHaveLength(0);
  });
});
