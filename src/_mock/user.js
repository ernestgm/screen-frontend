import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

// ----------------------------------------------------------------------

const users = [...Array(24)].map((_, index) => ({
  id: faker.datatype.uuid(),
  avatarUrl: `/assets/images/avatars/avatar_${index + 1}.jpg`,
  name: faker.name.fullName(),
  company: faker.company.name(),
  isVerified: faker.datatype.boolean(),
  status: sample(['active', 'banned']),
  role: sample([
    'Leader',
    'Hr Manager',
    'UI Designer',
    'UX Designer',
    'UI/UX Designer',
    'Project Manager',
    'Backend Developer',
    'Full Stack Designer',
    'Front End Developer',
    'Full Stack Developer',
  ]),
}));

/* created_at
    :
    "2023-04-03T14:51:57.000000Z"
email
    :
    "ernestgm2006@gmail.com"
email_verified_at
    :
    null
id
    :
    1
lastname
    :
    "Gonzalez"
name
    :
    "Ernesto"
password
    :
    "$2y$10$JPgXeJ.KwjL.ksJAV4X18uu0iT/H.Xn9ey/qSTDdiD924nV4Z60pG"
remember_token
    :
    null
updated_at
    :
    "2023-04-03T14:51:57.000000Z"

    */

export default users;
