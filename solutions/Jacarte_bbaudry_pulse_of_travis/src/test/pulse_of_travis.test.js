const pulse = require('../pulse_of_travis.js');

//test('initialize synthesizers', () => {
//    initSynthPool();
//    expect(pulse.synthPool.length).toBe(pulse.maxNumberTracks);
//  });



test('adds 1 + 2 to equal 3', () => {
  expect(pulse.sum(1, 2)).toBe(3);
});