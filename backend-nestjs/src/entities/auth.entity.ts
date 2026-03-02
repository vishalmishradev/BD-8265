import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'authUsers' })
export class AuthUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20 })
  first_name: string;

  @Column({ type: 'varchar', length: 20 })
  last_name: string;

  @Column({ type: 'varchar', length: 30 })
  user_name: string;

  @Column({ type: 'varchar' })
  @Exclude()
  password: string;

  @Column({ type: 'boolean', default: false })
  is_admin: boolean;
}
