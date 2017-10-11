import { Table, Column, Model, HasOne } from 'sequelize-typescript';
import Address from './address.model';
import Phone from './phone.model';

@Table({
  tableName: 'customer'
})
export default class Customer extends Model<Customer> {
  @Column company: string;
  @Column email: string;
  @Column firstName: string;
  @Column isActive: boolean;
  @Column lastName: string;
  @Column notes: string;
  @HasOne(() => Address, { foreignKey: 'customerId' }) address: Address;
  // @HasOne(() => Phone, { foreignKey: 'faxId' }) fax: Phone;
  @HasOne(() => Phone, { foreignKey: 'phoneId' }) phone: Phone;
}
