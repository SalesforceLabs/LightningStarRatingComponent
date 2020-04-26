/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { createElement } from 'lwc';
import StarRating from 'c/starRatings';

/**
 * Creates a new instance of an LWC component and assigns public properties.
 *
 * @param {string} name A string that specifies the type of element to be
 *     created.
 * @param {ElementCreationOptions} options An optional object containing a
 *     single property named <tt>is</tt>.
 * @param {Object} props An optional object of key-value pairs to assign to
 *     the newly created element's public properties.
 * @returns The newly created element.
 */
function createElementWithProps(name, options, props = {}) {
    return Object.assign(
        createElement(name, options),
        props,
    );
}

describe('c-star-rating', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('contains a div that has default class names.', () => {
        const RATING_CLASS = ["rating value-0 medium label-left space-small"];

        const element = createElement('c-star-rating', { is: StarRating });
        document.body.appendChild(element);

        // Get div element
        const divEl = element.shadowRoot.querySelector('div');
        expect(
            RATING_CLASS.indexOf(divEl.className)
        ).toBeGreaterThanOrEqual(0);

        //assert default state.
        expect(element.size).toEqual("medium");
        expect(element.numberOfStars).toEqual(5);
        expect(element.rating).toEqual(0);

        expect(element.direction).toEqual("");
        expect(element.labelText).toEqual("");
        expect(element.labelPosition).toEqual("left");
        expect(element.labelHidden).toBeTruthy(); //it indicates lable visible in code

        expect(element.staticColor).toBeNull();
        expect(element.colorDefault).toBeDefined();
        expect(element.colorPositive).toBeDefined();
        expect(element.colorNegative).toBeDefined();
        expect(element.colorOk).toBeDefined();
        expect(element.spaceBetween).toEqual("space-small");

        expect(element.hoverEnabled).toBeFalsy();
        expect(element.disabled).toBeFalsy();
        expect(element.readOnly).toBeFalsy();
        expect(element.showHalfStars).toBeFalsy();

    });

    it('override default assertions and check the component div class names', () => {
        let element = createElementWithProps('c-star-rating',
            { is: StarRating },
            {
                labelPosition: "right",
                size: "small",
                rating: 3,
                showHalfStars: true,
                disabled: true,
                direction: "rtl",
                spaceBetween: "medium"
            },
        );
        document.body.appendChild(element);

        let EXPECTED_RATING_CLASSES = ["rating value-3 small disabled label-right direction-rtl space-medium"];

        // Get div element
        let divEl = element.shadowRoot.querySelector('div');
        expect(
            EXPECTED_RATING_CLASSES.indexOf(divEl.className) //class name should not contain "half" as the rating is non float value.
        ).toBeGreaterThanOrEqual(0);

        document.body.removeChild(document.body.firstChild);

        //test half star
        element = createElementWithProps('c-star-rating',
            { is: StarRating },
            {
                labelPosition: "bottom",
                size: "large",
                rating: 3.63,
                showHalfStars: true,
            },
        );
        document.body.appendChild(element);

        //value- should not be floating value
        EXPECTED_RATING_CLASSES = ["rating value-3 half large label-bottom space-small"];
        divEl = element.shadowRoot.querySelector('div');
        expect(
            EXPECTED_RATING_CLASSES.indexOf(divEl.className)
        ).toBeGreaterThanOrEqual(0);
    });

    it('contains a div tag that displays the parsed label text', () => {
        const LABEL_TEXT = 'My rating (${rating})';

        const element = createElementWithProps('c-star-rating',
            { is: StarRating },
            {
                labelPosition: "bottom",
                labelText: LABEL_TEXT,
                rating:3
            },
        );
        document.body.appendChild(element);

        // Get label element
        const labelEl = element.shadowRoot.querySelector('lightning-formatted-text');
        expect(labelEl.value).toEqual('My rating (3)');
    });

    it('should not contain label text div tag when label-hidden prop added', () => {
        const LABEL_TEXT = 'My Rating';

        const element = createElementWithProps('c-star-rating',
            { is: StarRating },
            {
                labelPosition: "bottom",
                labelText: LABEL_TEXT,
                labelHidden: true
            },
        );
        document.body.appendChild(element);

        // Get label element
        const labelEl = element.shadowRoot.querySelector('div.label-value');
        expect(labelEl).toBeNull();
    });

    it('verifies the dom structure based on number of stars', () => {
        const LABEL_TEXT = 'My Rating';
        const NUMBER_OF_STARS = 6;

        const element = createElementWithProps('c-star-rating',
            { is: StarRating },
            {
                labelPosition: "top",
                labelText: LABEL_TEXT,
                numberOfStars: NUMBER_OF_STARS
            },
        );
        document.body.appendChild(element);

        // Get star container element
        const starContainerEl = element.shadowRoot.querySelector('div.star-container');
        const starEls = starContainerEl.querySelectorAll('div.star');
        expect(starEls.length).toEqual(NUMBER_OF_STARS);
        starEls.forEach((star, index) => {
            expect(parseInt(star.getAttribute('data-rating'), 10)).toEqual(index + 1);
            let svgEmptyEl = star.querySelector('svg.star-empty')
            expect(svgEmptyEl).toBeDefined();

            let svgHalfEl = star.querySelector('svg.star-half')
            expect(svgHalfEl).toBeDefined();

            let svgFilledEl = star.querySelector('svg.star-filled')
            expect(svgFilledEl).toBeDefined();
        });

    });

    it('verifies rating selection with static color', () => {
        const LABEL_TEXT = 'My Rating';
        const NUMBER_OF_STARS = 6;
        const STATIC_COLOR = "green";

        const element = createElementWithProps('c-star-rating',
            { is: StarRating },
            {
                labelPosition: "top",
                labelText: LABEL_TEXT,
                numberOfStars: NUMBER_OF_STARS,
                staticColor: STATIC_COLOR
            },
        );
        document.body.appendChild(element);

        // Get star container element
        const starContainerEl = element.shadowRoot.querySelector('div.star-container');
        const starEls = starContainerEl.querySelectorAll('div.star');
        expect(starEls.length).toEqual(NUMBER_OF_STARS);

        const onStarRatingChange = jest.fn();
        element.addEventListener('ratingchange', onStarRatingChange);
        const elementToClick = 4;
        return Promise.resolve()
            .then(() => {
                starEls[elementToClick].click();
            })
            .then(() => {
                expect(onStarRatingChange).toHaveBeenCalledTimes(1);
                const divEl = element.shadowRoot.querySelector('div');
                expect(divEl.className.indexOf("value-5")).not.toEqual(-1);
                starEls.forEach((star) => {
                    let svgFilledEl = star.querySelector('svg.star-filled');
                    expect(svgFilledEl.getAttribute("fill")).toEqual(STATIC_COLOR);
                });
            });
    });

    it('verifies maximum number of stars', () => {
        const LABEL_TEXT = 'My Rating';
        const NUMBER_OF_STARS = 20;
        const MAXIMUM_NUMBER_OF_STARS = 15;
        const STATIC_COLOR = "green";

        const element = createElementWithProps('c-star-rating',
            { is: StarRating },
            {
                labelPosition: "top",
                labelText: LABEL_TEXT,
                numberOfStars: NUMBER_OF_STARS,
                staticColor: STATIC_COLOR
            },
        );
        document.body.appendChild(element);

        // Get container element
        const starContainerEl = element.shadowRoot.querySelector('div.star-container');
        const starEls = starContainerEl.querySelectorAll('div.star');
        expect(starEls.length).not.toEqual(NUMBER_OF_STARS);
        expect(starEls.length).toEqual(MAXIMUM_NUMBER_OF_STARS);
    });

    it('verifies read-only rating selection', () => {

        const element = createElementWithProps('c-star-rating',
            { is: StarRating },
            { readOnlyStar: true }
        );
        document.body.appendChild(element);

        // Get label element
        const starContainerEl = element.shadowRoot.querySelector('div.star-container');

        const starEls = starContainerEl.querySelectorAll('div.star');
        const onStarRatingChange = jest.fn();
        element.addEventListener('ratingchange', onStarRatingChange);
        const elementToClick = 4;
        return Promise.resolve()
            .then(() => {
                starEls[elementToClick].click();
            })
            .then(() => {
                expect(onStarRatingChange).not.toHaveBeenCalledTimes(1);
            });
    });

    it('verifies disabled rating selection', () => {

        const element = createElementWithProps('c-star-rating',
            { is: StarRating },
            { disabled: true }
        );
        document.body.appendChild(element);

        // Get label element
        const starContainerEl = element.shadowRoot.querySelector('div.star-container');

        const starEls = starContainerEl.querySelectorAll('div.star');
        const onStarRatingChange = jest.fn();
        element.addEventListener('ratingchange', onStarRatingChange);
        const elementToClick = 4;
        return Promise.resolve()
            .then(() => {
                starEls[elementToClick].click();
            })
            .then(() => {
                expect(onStarRatingChange).not.toHaveBeenCalledTimes(1);
            });
    });

    ['Plus', 'ArrowRight', 'ArrowUp'].forEach((eventName) => {
        it(`verify behaviour keyboard event ${eventName} incremental rating value`, () => {
            const DEFAULT_RATING = 3;
            const element = createElementWithProps('c-star-rating',
                { is: StarRating },
                { rating: DEFAULT_RATING },
            );
            document.body.appendChild(element);

            // Get label element
            const ratingEl = element.shadowRoot.querySelector('div.rating');

            const onStarRatingChange = jest.fn();
            element.addEventListener('ratingchange', onStarRatingChange);
            return Promise.resolve()
                .then(() => {
                    ratingEl.dispatchEvent(
                        new KeyboardEvent('keydown', {
                            code: `${eventName}`
                        })
                    );
                })
                .then(() => {
                    expect(onStarRatingChange).toHaveBeenCalledTimes(1);
                    const divEl = element.shadowRoot.querySelector('div');
                    //should increment by 1;
                    expect(divEl.className.indexOf("value-" + (DEFAULT_RATING + 1))).not.toEqual(-1);
                });
        });
    });

    ['Minus', 'ArrowDown', 'ArrowLeft'].forEach((eventName) => {
        it(`verify behaviour keyboard event ${eventName} decremental rating value`, () => {
            const DEFAULT_RATING = 3;
            const element = createElementWithProps('c-star-rating',
                { is: StarRating },
                { rating: DEFAULT_RATING },
            );
            document.body.appendChild(element);

            // Get label element
            const ratingEl = element.shadowRoot.querySelector('div.rating');

            const onStarRatingChange = jest.fn();
            element.addEventListener('ratingchange', onStarRatingChange);
            return Promise.resolve()
                .then(() => {
                    ratingEl.dispatchEvent(
                        new KeyboardEvent('keydown', {
                            code: `${eventName}`
                        })
                    );
                })
                .then(() => {
                    expect(onStarRatingChange).toHaveBeenCalledTimes(1);
                    const divEl = element.shadowRoot.querySelector('div');
                    //should decrement by 1;
                    expect(divEl.className.indexOf("value-" + (DEFAULT_RATING - 1))).not.toEqual(-1);
                });
        });
    });

    ['Backspace', 'Delete', 'Digit0'].forEach((eventName) => {
        it(`verify behaviour keyboard event ${eventName} resetting rating value`, () => {
            const DEFAULT_RATING = 3;
            const element = createElementWithProps('c-star-rating',
                { is: StarRating },
                { rating: DEFAULT_RATING },
            );
            document.body.appendChild(element);

            // Get label element
            const ratingEl = element.shadowRoot.querySelector('div.rating');

            const onStarRatingChange = jest.fn();
            element.addEventListener('ratingchange', onStarRatingChange);
            return Promise.resolve()
                .then(() => {
                    ratingEl.dispatchEvent(
                        new KeyboardEvent('keydown', {
                            code: `${eventName}`
                        })
                    );
                })
                .then(() => {
                    expect(onStarRatingChange).toHaveBeenCalledTimes(1);
                    const divEl = element.shadowRoot.querySelector('div');
                    //should reset to 0
                    expect(divEl.className.indexOf("value-0")).not.toEqual(-1);
                });
        });
    });

    ['Digit3', 'Digit6'].forEach((eventName) => {
        it(`verify behaviour keyboard event ${eventName} by digits rating value`, () => {
            const element = createElementWithProps('c-star-rating',
                { is: StarRating },
            );
            document.body.appendChild(element);

            // Get label element
            const ratingEl = element.shadowRoot.querySelector('div.rating');

            const onStarRatingChange = jest.fn();
            element.addEventListener('ratingchange', onStarRatingChange);
            return Promise.resolve()
                .then(() => {
                    ratingEl.dispatchEvent(
                        new KeyboardEvent('keydown', {
                            code: `${eventName}`
                        })
                    );
                })
                .then(() => {
                    expect(onStarRatingChange).toHaveBeenCalledTimes(1);
                    const divEl = element.shadowRoot.querySelector('div');
                    let ratingValue;
                    if (`${eventName}` === "Digit3") {
                        ratingValue = "value-3";
                    } else if (`${eventName}` === "Digit6") { //if more than default rating , it should reset to max value
                        ratingValue = "value-6";
                    }
                    expect(divEl.className.indexOf(ratingValue)).not.toEqual(-1);
                });
        });
    });

    [0, 1, 3, 5].forEach((ratingValue) => {
        it(`verify different colors  ${ratingValue} for each rating`, () => {
            const COLOR_POSITIVE = "#00f", COLOR_DEFAULT = "#a2a4a7", COLOR_OK = "#f00", COLOR_NEGATIVE = "#7f0404";
            const COLOR_MAP = {
                0: COLOR_DEFAULT,
                1: COLOR_NEGATIVE,
                3: COLOR_OK,
                5: COLOR_POSITIVE
            }
            const element = createElementWithProps('c-star-rating',
                { is: StarRating },
                {
                    rating: `${ratingValue}`,
                    colorDefault: COLOR_DEFAULT,
                    colorNegative: COLOR_NEGATIVE,
                    colorPositive: COLOR_POSITIVE,
                    colorOk: COLOR_OK
                },
            );
            document.body.appendChild(element);

            const starContainerEl = element.shadowRoot.querySelector('div.star-container');
            const starEls = starContainerEl.querySelectorAll('div.star');
            starEls.forEach((star) => {
                let svgFilledEl = star.querySelector('svg.star-filled');
                expect(svgFilledEl.getAttribute("fill")).toEqual(COLOR_MAP[`${ratingValue}`]);
            });
        });
    });

});