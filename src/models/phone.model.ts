import { Table, Column, Model, BelongsTo, ForeignKey } from 'sequelize-typescript';
import Customer from './customer.model';

@Table({
  tableName: 'phone'
})
export default class Phone extends Model<Phone> {
  @Column number: string;
  @Column extension?: number;
  @Column type: PhoneType;
  @BelongsTo(() => Customer, 'phoneId') customer: Customer;
  // @BelongsTo(() => Customer, 'faxId') customer: Customer;
}

export enum PhoneType {
  Cell,
  Fax,
  Home,
  Work,
}
