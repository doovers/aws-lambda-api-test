import { Table, Column, Model, BelongsTo, ForeignKey } from 'sequelize-typescript';
import Customer from './customer.model';

@Table({
  tableName: 'address'
})
export default class Address extends Model<Address> {
  @Column street: String;
  @Column city: String;
  @Column country: String;
  @Column region: String;
  @Column postalCode: String;
  @BelongsTo(() => Customer, { foreignKey: 'customerId' }) customer: Customer;
}
