const Profile = require('../../models/Profile');
const validateModelAndExpect = require('./utils');

describe('Profile Model validation', () => {
  let mockedProfile = {
    user: '5e8361ca715fcf700ece9745',
    bio: 'I am super cool and trying to be better in my life :D',
    company: 'asd',
    date: 1,
    education: [],
    experience: [],
    githubUsername: 'anUsername',
    location: 'Buenos Aires, Argentina',
    skills: ['HTML', 'CSS', 'PHP', 'something about banco', 'JS'],
    status: 'Pasante Seg Info',
    website: 'https://google.com',
  };

  afterEach(() => {
    mockedProfile = {
      user: '5e8361ca715fcf700ece9745',
      bio: 'I am super cool and trying to be better in my life :D',
      company: 'asd',
      date: 1,
      education: [],
      experience: [],
      githubUsername: 'anUsername',
      location: 'Buenos Aires, Argentina',
      skills: ['HTML', 'CSS', 'PHP', 'something about banco', 'JS'],
      status: 'Pasante Seg Info',
      website: 'https://google.com',
    };
  });

  it('validates an OK profile', async () => {
    const profile = new Profile(mockedProfile);

    await validateModelAndExpect(profile, (errorMessage) => {
      expect(errorMessage).toBeFalsy();
    });
  });

  it('does not validate a profile without a required parameter', async () => {
    mockedProfile.status = undefined;
    const profile = new Profile(mockedProfile);

    await validateModelAndExpect(profile, (errorMessage) => {
      expect(errorMessage).toBe(
        'profile validation failed: status: status is required'
      );
    });
  });
});
