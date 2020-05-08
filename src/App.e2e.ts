import { Machine, assign } from 'xstate'
import  { createModel } from  '@xstate/test'
import { Page } from 'puppeteer';

describe('counter app', () => {
  const feedbackMachine = Machine({
    id: 'toggle',
    initial: 'Init',
    context: {
      count: 0
    },
    states: {
      Init: {
        on: {
          COUNT: {
            target: 'Count',
            actions: ['inc']
          },
          RESET: {
            target: 'Init',
            actions: ['reset']
          }
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
      Count: {
        on: {
          COUNT: {
            target: 'Count',
            actions: ['inc']
          },
          RESET: {
            target: 'Init',
            actions: ['reset']
          }
        },
        meta: {
          test: async (page: Page, state:any) => {
            await page.waitFor('[data-testid="counter-screen"]');
            const counterEl = await page.$('[data-testid="value-counter"]');
            const cc: number = await page.evaluate(el => el.textContent, counterEl)
            
            expect(cc).toBe(state.context.count.toString())
          }
        }
      },
    
  }

  }, {
    actions: {
    inc: assign<{count: number}>({count: (ctx, e)=> ctx.count + 1}),
    reset: assign<{count: number}>({count: (ctx, e)=> 0})
  }});

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

  const testPlans = testModel.getShortestPathPlans({
    filter: state => state.context.count < 5
  });
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
