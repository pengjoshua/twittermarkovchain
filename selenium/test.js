const {Builder, By, until} = require('selenium-webdriver');
const webdriver = require('selenium-webdriver');
const test = require('./testing');
const chrome = require('selenium-webdriver/chrome');
const path = require('chromedriver').path;

const service = new chrome.ServiceBuilder(path).build();
chrome.setDefaultService(service);

const driver = new webdriver.Builder()
    .withCapabilities(webdriver.Capabilities.chrome())
    .build();

test.describe('Twitter Markov Chain UI', function() {

  test.it('can reach the Twitter Markov Chain webpage', function*() {
    yield driver.get('http://localhost:3000');
    yield driver.wait(until.titleIs('Twitter Markov Chain'), 15000);
  });

  test.it('can log in as Test', function*() {
    yield driver.get('http://localhost:3000');
    yield driver.wait(until.titleIs('Twitter Markov Chain'), 5000);
    yield driver.findElement(By.className('form-control login-email')).click();
    yield driver.findElement(By.className('form-control login-email')).sendKeys('test@gmail.com');
    yield driver.findElement(By.className('form-control login-password')).click();
    yield driver.findElement(By.className('form-control login-password')).sendKeys('test123');
    yield driver.findElement(By.className('button-login')).click();
    yield driver.wait(until.elementLocated(By.className('user loggedin')), 5000);
    yield driver.findElement(By.className('user loggedin')).click();
  });

  test.it('can log in as Test and generate 5 Markov chains for @hello', function*() {
    yield driver.get('http://localhost:3000');
    yield driver.wait(until.titleIs('Twitter Markov Chain'), 5000);
    yield driver.findElement(By.className('form-control login-email')).click();
    yield driver.findElement(By.className('form-control login-email')).sendKeys('test@gmail.com');
    yield driver.findElement(By.className('form-control login-password')).click();
    yield driver.findElement(By.className('form-control login-password')).sendKeys('test123');
    yield driver.findElement(By.className('button-login')).click();
    yield driver.wait(until.elementLocated(By.className('user loggedin')), 5000);
    yield driver.findElement(By.className('form-control handle-generate')).click();
    yield driver.findElement(By.className('form-control handle-generate')).sendKeys('hello');
    yield driver.findElement(By.className('form-control number-generate')).click();
    yield driver.findElement(By.className('form-control number-generate')).sendKeys('5');
    yield driver.findElement(By.className('button-generate')).click();
    yield driver.wait(until.elementLocated(By.className('generatedtitle')), 5000);
  });

  test.it('can log in as Test and generate5 Markov chains for @hello', function*() {
    yield driver.get('http://localhost:3000');
    yield driver.wait(until.titleIs('Twitter Markov Chain'), 5000);
    yield driver.findElement(By.className('form-control login-email')).click();
    yield driver.findElement(By.className('form-control login-email')).sendKeys('test@gmail.com');
    yield driver.findElement(By.className('form-control login-email')).click();
    yield driver.findElement(By.className('form-control login-password')).sendKeys('test123');
    yield driver.findElement(By.className('button-login')).click();
    yield driver.wait(until.elementLocated(By.className('user loggedin')), 5000);
    yield driver.findElement(By.className('form-control handle-generate')).click();
    yield driver.findElement(By.className('form-control handle-generate')).sendKeys('hello');
    yield driver.findElement(By.className('form-control number-generate')).click();
    yield driver.findElement(By.className('form-control number-generate')).sendKeys('15');
    yield driver.findElement(By.className('button-generate')).click();
    yield driver.wait(until.elementLocated(By.className('generatedtitle')), 5000);
  });

  test.it('can log in as Test, generate tweets, and save tweets', function*() {
    yield driver.get('http://localhost:3000');
    yield driver.wait(until.titleIs('Twitter Markov Chain'), 5000);
    yield driver.findElement(By.className('form-control login-email')).click();
    yield driver.findElement(By.className('form-control login-email')).sendKeys('test@gmail.com');
    yield driver.findElement(By.className('form-control login-password')).click();
    yield driver.findElement(By.className('form-control login-password')).sendKeys('test123');
    yield driver.findElement(By.className('button-login')).click();
    yield driver.wait(until.elementLocated(By.className('user loggedin')), 5000);
    yield driver.findElement(By.className('form-control handle-generate')).click();
    yield driver.findElement(By.className('form-control handle-generate')).sendKeys('hello');
    yield driver.findElement(By.className('form-control number-generate')).click();
    yield driver.findElement(By.className('form-control number-generate')).sendKeys('15');
    yield driver.findElement(By.className('button-generate')).click();
    yield driver.wait(until.elementLocated(By.className('generatedtitle')), 5000);
    yield driver.findElement(By.className('button-save')).click();
    yield driver.findElement(By.className('button-save')).click();
    yield driver.findElement(By.className('button-save')).click();
    yield driver.wait(until.elementLocated(By.className('favoritestitle')), 5000);
  });

  test.it('can log in as Test, generate tweets, save 3 tweets, and delete them', function*() {
    yield driver.get('http://localhost:3000');
    yield driver.wait(until.titleIs('Twitter Markov Chain'), 5000);
    yield driver.findElement(By.className('form-control login-email')).click();
    yield driver.findElement(By.className('form-control login-email')).sendKeys('test@gmail.com');
    yield driver.findElement(By.className('form-control login-password')).click();
    yield driver.findElement(By.className('form-control login-password')).sendKeys('test123');
    yield driver.findElement(By.className('button-login')).click();
    yield driver.wait(until.elementLocated(By.className('user loggedin')), 5000);
    yield driver.findElement(By.className('form-control handle-generate')).click();
    yield driver.findElement(By.className('form-control handle-generate')).sendKeys('hello');
    yield driver.findElement(By.className('form-control number-generate')).click();
    yield driver.findElement(By.className('form-control number-generate')).sendKeys('15');
    yield driver.findElement(By.className('button-generate')).click();
    yield driver.wait(until.elementLocated(By.className('generatedtitle')), 5000);
    yield driver.findElement(By.className('button-save')).click();
    yield driver.findElement(By.className('button-save')).click();
    yield driver.findElement(By.className('button-save')).click();
    yield driver.findElement(By.className('button-delete')).click();
    yield driver.findElement(By.className('button-delete')).click();
    yield driver.findElement(By.className('button-delete')).click();
  });

  test.it('can log in as Test, generate tweets, save 3 tweets, and delete them, logout and repeat the same steps', function*() {
    yield driver.get('http://localhost:3000');
    yield driver.wait(until.titleIs('Twitter Markov Chain'), 5000);
    yield driver.findElement(By.className('form-control login-email')).click();
    yield driver.findElement(By.className('form-control login-email')).sendKeys('test@gmail.com');
    yield driver.findElement(By.className('form-control login-password')).click();
    yield driver.findElement(By.className('form-control login-password')).sendKeys('test123');
    yield driver.findElement(By.className('button-login')).click();
    yield driver.wait(until.elementLocated(By.className('user loggedin')), 5000);
    yield driver.findElement(By.className('form-control handle-generate')).click();
    yield driver.findElement(By.className('form-control handle-generate')).sendKeys('hello');
    yield driver.findElement(By.className('form-control number-generate')).click();
    yield driver.findElement(By.className('form-control number-generate')).sendKeys('15');
    yield driver.findElement(By.className('button-generate')).click();
    yield driver.wait(until.elementLocated(By.className('generatedtitle')), 5000);
    yield driver.findElement(By.className('button-save')).click();
    yield driver.findElement(By.className('button-save')).click();
    yield driver.findElement(By.className('button-save')).click();
    yield driver.findElement(By.className('button-delete')).click();
    yield driver.findElement(By.className('button-delete')).click();
    yield driver.findElement(By.className('button-delete')).click();
    yield driver.findElement(By.className('button-logout')).click();
    yield driver.wait(until.elementLocated(By.className('button-login')), 5000);
    yield driver.findElement(By.className('form-control login-email')).click();
    yield driver.findElement(By.className('form-control login-email')).sendKeys('test@gmail.com');
    yield driver.findElement(By.className('form-control login-email')).click();
    yield driver.findElement(By.className('form-control login-password')).sendKeys('test123');
    yield driver.findElement(By.className('button-login')).click();
    yield driver.wait(until.elementLocated(By.className('user loggedin')), 5000);
    yield driver.findElement(By.className('form-control handle-generate')).click();
    yield driver.findElement(By.className('form-control handle-generate')).sendKeys('hello');
    yield driver.findElement(By.className('form-control number-generate')).click();
    yield driver.findElement(By.className('form-control number-generate')).sendKeys('15');
    yield driver.findElement(By.className('button-generate')).click();
    yield driver.wait(until.elementLocated(By.className('generatedtitle')), 5000);
    yield driver.findElement(By.className('button-save')).click();
    yield driver.findElement(By.className('button-save')).click();
    yield driver.findElement(By.className('button-save')).click();
    yield driver.findElement(By.className('button-delete')).click();
    yield driver.findElement(By.className('button-delete')).click();
    yield driver.findElement(By.className('button-delete')).click();
  });

  test.it('can create new user, generate tweets, save 3 tweets, and delete them, logout and repeat the same steps as Test', function*() {
    const randName = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 7);
    const randPassword = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 7);
    const randEmail = `${randName}@email.com`;
    yield driver.get('http://localhost:3000');
    yield driver.wait(until.titleIs('Twitter Markov Chain'), 5000);
    yield driver.findElement(By.className('button-register')).click();
    yield driver.findElement(By.className('form-control signup-name')).click();
    yield driver.findElement(By.className('form-control signup-name')).sendKeys(randName);
    yield driver.findElement(By.className('form-control signup-email')).click();
    yield driver.findElement(By.className('form-control signup-email')).sendKeys(randEmail);
    yield driver.findElement(By.className('form-control signup-password')).click();
    yield driver.findElement(By.className('form-control signup-password')).sendKeys(randPassword);
    yield driver.findElement(By.className('form-control signup-password2')).click();
    yield driver.findElement(By.className('form-control signup-password2')).sendKeys(randPassword);
    yield driver.findElement(By.className('button-signup')).click();
    yield driver.wait(until.elementLocated(By.className('user loggedin')), 5000);
    yield driver.findElement(By.className('form-control handle-generate')).click();
    yield driver.findElement(By.className('form-control handle-generate')).sendKeys('hello');
    yield driver.findElement(By.className('form-control number-generate')).click();
    yield driver.findElement(By.className('form-control number-generate')).sendKeys('15');
    yield driver.findElement(By.className('button-generate')).click();
    yield driver.wait(until.elementLocated(By.className('generatedtitle')), 5000);
    yield driver.findElement(By.className('button-save')).click();
    yield driver.findElement(By.className('button-save')).click();
    yield driver.findElement(By.className('button-save')).click();
    yield driver.findElement(By.className('button-delete')).click();
    yield driver.findElement(By.className('button-delete')).click();
    yield driver.findElement(By.className('button-delete')).click();
    yield driver.findElement(By.className('button-logout')).click();
    yield driver.wait(until.elementLocated(By.className('button-login')), 5000);
    yield driver.findElement(By.className('form-control login-email')).click();
    yield driver.findElement(By.className('form-control login-email')).sendKeys('test@gmail.com');
    yield driver.findElement(By.className('form-control login-email')).click();
    yield driver.findElement(By.className('form-control login-password')).sendKeys('test123');
    yield driver.findElement(By.className('button-login')).click();
    yield driver.wait(until.elementLocated(By.className('user loggedin')), 5000);
    yield driver.findElement(By.className('form-control handle-generate')).click();
    yield driver.findElement(By.className('form-control handle-generate')).sendKeys('hello');
    yield driver.findElement(By.className('form-control number-generate')).click();
    yield driver.findElement(By.className('form-control number-generate')).sendKeys('15');
    yield driver.findElement(By.className('button-generate')).click();
    yield driver.wait(until.elementLocated(By.className('generatedtitle')), 5000);
    yield driver.findElement(By.className('button-save')).click();
    yield driver.findElement(By.className('button-save')).click();
    yield driver.findElement(By.className('button-save')).click();
  });

  test.after(() => driver.quit());
});
