export function initialize(application) {
  application.inject('route', 'phoenix', 'service:phoenix');
}

export default {
  name: 'phoenix',
  initialize
};
