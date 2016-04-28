import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
  body: attr(),
  createdAt: attr("date", {
    defaultValue(){ return new Date(); }
  })
});
