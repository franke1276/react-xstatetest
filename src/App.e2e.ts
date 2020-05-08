import { Machine } from 'xstate'
import  { createModel } from  '@xstate/test'
import { Page } from 'puppeteer';

describe('counter app', () => {
  const feedbackMachine = Machine({
    id: 'toggle',
    initial: 'Init',
    states: {
      Init: {
        on: {
          COUNT: 'Count_1',
          RESET: 'Init',
        },
        meta: {
          test: async (page: Page) => {
            await page.waitFor('[data-testid="counter-screen"]');
            const counterEl = await page.$('[data-testid="value-counter"]');
            const counter: string = await page.evaluate(el => el.textContent, counterEl)
            expect(counter).toBe("0")
          }
        }
      },
      Count_1: {
        on: {
          COUNT: 'Count_2',
          RESET: 'Init',
        },
        meta: {
          test: async (page: Page) => {
            await page.waitFor('[data-testid="counter-screen"]');
            const counterEl = await page.$('[data-testid="value-counter"]');
            const counter: number = await page.evaluate(el => el.textContent, counterEl)
            expect(counter).toBe("1")
          }
        }
      },

    Count_2: {
      on: {
        RESET: 'Init',
      },
      meta: {
        test: async (page: Page) => {
          const counterEl = await page.$('[data-testid="value-counter"]');
            const counter: number = await page.evaluate(el => el.textContent, counterEl)
            expect(counter).toBe("2")
        }
      }
    },
    
  }

  });

  const testModel = createModel(feedbackMachine, {
    events: {
      COUNT: async (page: Page) => {
        await page.click('[data-testid="button-count"]');
      },
      RESET: async (page: Page) => {
        await page.click('[data-testid="button-reset"]');
      },
    }
  });

  const testPlans = testModel.getSimplePathPlans();
  console.log(testPlans)
  testPlans.forEach((plan, i) => {
    describe(plan.description, () => {
      plan.paths.forEach((path, i) => {
        it(
          path.description,
          async () => {
            await page.goto('http://localhost:3000');
            await path.test(page);
          },
          10000
        );
      });
    });
  });

  it('coverage', () => {
    testModel.testCoverage();
  });
});
