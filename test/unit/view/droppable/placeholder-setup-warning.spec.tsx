import React from 'react';
import type { ReactWrapper } from 'enzyme';
import type { DroppableProvided } from '../../../../src/view/droppable/droppable-types';
import {
  homeAtRest,
  foreignOwnProps,
  isOverForeign,
  isNotOverForeign,
} from './util/get-props';
import mount from './util/mount';
import { disableWarn } from '../../../util/console';

class WithNoPlaceholder extends React.Component<{
  provided: DroppableProvided;
}> {
  render() {
    return (
      <div
        ref={this.props.provided.innerRef}
        {...this.props.provided.droppableProps}
      >
        Not rendering placeholder
      </div>
    );
  }
}

disableWarn();

describe('is over foreign', () => {
  it('should log a warning when mounting', () => {
    const wrapper: ReactWrapper<any> = mount({
      ownProps: foreignOwnProps,
      mapProps: isOverForeign,
      WrappedComponent: WithNoPlaceholder,
    });

    expect(console.warn).toHaveBeenCalled();

    wrapper.unmount();
  });

  it('should log a warning when updating', () => {
    const wrapper: ReactWrapper<any> = mount({
      ownProps: foreignOwnProps,
      mapProps: homeAtRest,
      WrappedComponent: WithNoPlaceholder,
    });
    expect(console.warn).not.toHaveBeenCalled();

    wrapper.setProps(isOverForeign);
    expect(console.warn).toHaveBeenCalled();

    wrapper.unmount();
  });
});

describe('is not over foreign', () => {
  it('should not log a warning when mounting', () => {
    const wrapper: ReactWrapper<any> = mount({
      ownProps: foreignOwnProps,
      mapProps: isNotOverForeign,
      WrappedComponent: WithNoPlaceholder,
    });

    expect(console.warn).not.toHaveBeenCalled();

    wrapper.unmount();
  });

  it('should not log a warning when updating', () => {
    const wrapper: ReactWrapper<any> = mount({
      ownProps: foreignOwnProps,
      mapProps: homeAtRest,
      WrappedComponent: WithNoPlaceholder,
    });
    expect(console.warn).not.toHaveBeenCalled();

    wrapper.setProps(isNotOverForeign);
    expect(console.warn).not.toHaveBeenCalled();

    wrapper.unmount();
  });
});
