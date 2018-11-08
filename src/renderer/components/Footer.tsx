import * as React from 'react';
import { IDefaultProps } from '../interfaces';
import { BrowsePageLayout, parseBrowsePageLayout, stringifyBrowsePageLayout } from '../../shared/BrowsePageLayout';
import { gameScaleSpan } from '../Util';

export interface IFooterProps extends IDefaultProps {
  gameCount?: number;
  /** Value of the scale slider (between 0 - 1) */
  scaleSliderValue: number;
  /** When the value of the scale slider is changed (value is between 0 and 1) */
  onScaleSliderChange?: (value: number) => void;
  /** BrowsePage layout */
  layout: BrowsePageLayout;
  /** When the value of the layout selector is changed */
  onLayoutChange?: (value: BrowsePageLayout) => void;
  /** When the "New Game" button is clicked */
  onNewGameClick?: () => void;
}

export class Footer extends React.Component<IFooterProps, {}> {
  private static scaleSliderMax: number = 1000;

  constructor(props: IFooterProps) {
    super(props);
    this.onScaleSliderChange = this.onScaleSliderChange.bind(this);
    this.onLayoutChange = this.onLayoutChange.bind(this);
    this.onNewGameClick = this.onNewGameClick.bind(this);
  }

  render() {
    const scale = Math.min(Math.max(0, this.props.scaleSliderValue), 1);
    return (
      <div className='footer'>
        <div className='footer__wrap'>
          <div className='footer__game-count'>
            {(this.props.gameCount !== undefined) ? (
              <>Games Total: {this.props.gameCount}</>
            ) : (
              <>No Games Found!</>
            )}
          </div>
        </div>
        <div className='footer__wrap footer__right'>
          <div>
            <div className='footer__right__inner'>
              {/* New Game */}
              { window.External.config.data.disableEditing ? undefined : (
                <div className='footer__wrap'>
                  <div className='simple-center'>
                    <input type='button' value='New Game' onClick={this.onNewGameClick}
                          className='footer__new-game simple-button simple-center__vertical-inner' />
                  </div>
                </div>
              ) }
              {/* Layout Selector */}
              <div className='footer__wrap'>
                <div>
                  <select className='footer__layout-selector simple-selector' value={stringifyBrowsePageLayout(this.props.layout)} onChange={this.onLayoutChange}>
                    <option value='list'>List</option>
                    <option value='grid'>Grid</option>
                  </select>
                </div>
              </div>
              {/* Scale Slider */}
              <div className='footer__wrap footer__scale-slider'>
                <div className='footer__scale-slider__inner'>
                  <div className='footer__scale-slider__icon footer__scale-slider__icon--left simple-center'>
                    <div>-</div>
                  </div>
                  <div className='footer__scale-slider__icon footer__scale-slider__icon--center simple-center' />
                  <div className='footer__scale-slider__icon footer__scale-slider__icon--right simple-center'>
                    <div>+</div>
                  </div>
                  <input type='range' className='footer__scale-slider__input hidden-slider'
                         value={scale * Footer.scaleSliderMax} min={0} max={Footer.scaleSliderMax}
                         onChange={this.onScaleSliderChange} />
                </div>
              </div>
              {/* Slider Percent */}
              <div className='footer__wrap footer__scale-percent'>
                <p>{Math.round(100 + (scale - 0.5) * 200 * gameScaleSpan)}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  onScaleSliderChange(event: React.ChangeEvent<HTMLInputElement>): void {
    if (this.props.onScaleSliderChange) {
      this.props.onScaleSliderChange(event.target.valueAsNumber / Footer.scaleSliderMax);
    }
  }
  
  onLayoutChange(event: React.ChangeEvent<HTMLSelectElement>): void {
    if (this.props.onLayoutChange) {
      const value = parseBrowsePageLayout(event.target.value);
      if (value === undefined) { throw new Error(`Layout selector option has an invalid value (${event.target.value})`); }
      this.props.onLayoutChange(value);
    }
  }

  onNewGameClick(): void {
    if (this.props.onNewGameClick) {
      this.props.onNewGameClick();
    }
  }
}
