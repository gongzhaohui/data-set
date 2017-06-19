const {
  assign,
  difference,
  pick,
  keys
} = require('lodash');
const {
  expect
} = require('chai');
const {
  DataSet,
  DataView,
  getTransform
} = require('../../../index');

describe('DataView.transform(): fold', () => {
  const data = [
    { a: '!', b: 5, c: 7, d: '|' },
    { a: '?', b: 2, c: 4, d: '/' }
  ];
  const row0 = data[0];
  const row1 = data[1];
  const dataKeys = keys(row0);
  const dataSet = new DataSet();
  let dataView;

  beforeEach(() => {
    dataView = new DataView(dataSet);
    dataView.source(data);
  });

  it('api', () => {
    expect(getTransform('fold')).to.be.a('function');
  });

  it('default', () => {
    dataView.transform({
      type: 'fold'
    });
    expect(dataView.rows.length).to.be.equal(8);
    expect(keys(dataView.rows[0])).to.be.deep.equal([
      'key',
      'value'
    ]);
  });

  it('fold: specify key and value', () => {
    dataView.transform({
      type: 'fold',
      key: 'type',
      value: 'typeValue'
    });
    expect(dataView.rows.length).to.be.equal(8);
    expect(keys(dataView.rows[0])).to.be.deep.equal([
      'type',
      'typeValue'
    ]);
  });

  it('fold: specify empty fields', () => {
    dataView.transform({
      type: 'fold',
      fields: []
    });
    expect(dataView.rows.length).to.be.equal(8);
  });

  it('fold: specify one field', () => {
    const fields = [ 'a' ];
    dataView.transform({
      type: 'fold',
      fields
    });
    expect(dataView.rows.length).to.be.equal(2);
    expect(dataView.rows[0]).to.be.deep.equal(assign({
      key: 'a',
      value: row0.a
    }, pick(row0, difference(dataKeys, fields))));
    expect(dataView.rows[1]).to.be.deep.equal(assign({
      key: 'a',
      value: row1.a
    }, pick(row1, difference(dataKeys, fields))));
  });

  it('fold: specify multiple fields', () => {
    const fields = [ 'b', 'c' ];
    dataView.transform({
      type: 'fold',
      fields
    });
    expect(dataView.rows.length).to.be.equal(4);
    expect(dataView.rows[0]).to.be.deep.equal(assign({
      key: 'b',
      value: row0.b
    }, pick(row0, difference(dataKeys, fields))));
    expect(dataView.rows[1]).to.be.deep.equal(assign({
      key: 'c',
      value: row0.c
    }, pick(row0, difference(dataKeys, fields))));
    expect(dataView.rows[2]).to.be.deep.equal(assign({
      key: 'b',
      value: row1.b
    }, pick(row1, difference(dataKeys, fields))));
    expect(dataView.rows[3]).to.be.deep.equal(assign({
      key: 'c',
      value: row1.c
    }, pick(row1, difference(dataKeys, fields))));
  });

  it('fold: specify retains', () => {
    const fields = [ 'a' ];
    const retains = [ 'b', 'c' ];
    dataView.transform({
      type: 'fold',
      fields,
      retains
    });
    expect(dataView.rows.length).to.be.equal(2);
    expect(dataView.rows[0]).to.be.deep.equal(assign({
      key: 'a',
      value: row0.a
    }, pick(row0, retains)));
    expect(dataView.rows[1]).to.be.deep.equal(assign({
      key: 'a',
      value: row1.a
    }, pick(row1, retains)));
  });
});