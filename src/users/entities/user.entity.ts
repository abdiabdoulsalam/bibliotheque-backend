import { ApiProperty } from '@nestjs/swagger';
import { ROLE } from 'src/common/enums/role.enum';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CommentEntity } from '~/comments/entities/comment.entity';
import { PostEntity } from '~/posts/entities/post.entity';

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
  @ApiProperty({
    description: 'Unique identifiant de la personne',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @ApiProperty({
    description: 'nom de la personne',
    example: 'Youssou',
  })
  @Column({ type: 'varchar', length: 32, nullable: false })
  readonly username: string;

  @ApiProperty({
    description: 'Email de la personne',
    example: 'your@example.com',
  })
  @Column({ type: 'varchar', length: 254, nullable: false })
  readonly email: string;

  @ApiProperty({
    description: 'mot de passe de la personne',
    example: 'your@example.com',
  })
  @Column({ type: 'varchar', length: 254, nullable: false })
  readonly password: string;

  @ApiProperty({
    description: 'Role de la personne',
    example: ROLE.USER,
    enum: ROLE,
    enumName: 'ROLE',
  })
  @Column({
    type: 'enum',
    enum: ROLE,
    default: ROLE.USER,
  })
  readonly role: ROLE;

  @ApiProperty({
    description: 'code',
    example: '123456',
  })
  @Column({ nullable: true })
  code: number;

  @ApiProperty({
    description: 'Etat du code user',
    example: true,
  })
  @Column({ type: 'boolean', default: false })
  is_code_used: boolean;

  @ApiProperty({
    description: 'Liste des orders',
    type: () => [PostEntity],
    isArray: true,
  })
  @OneToMany(() => PostEntity, (post) => post.user)
  posts: PostEntity[];

  @ApiProperty({
    description: 'Liste des orders',
    type: () => [CommentEntity],
    isArray: true,
  })
  @OneToMany(() => CommentEntity, (comment) => comment.user)
  comment: CommentEntity[];

  @ApiProperty({
    description: 'Date de creation de la personne',
    example: '2016-10-19 13:24:51.000000',
  })
  @CreateDateColumn({
    type: 'timestamp with time zone',
    nullable: true,
  })
  readonly created_at: Date;

  @ApiProperty({
    description: 'Date de la derniere mis a jour de la personne',
    example: '2016-10-19 13:24:51.000000',
  })
  @UpdateDateColumn({
    type: 'timestamp with time zone',
    nullable: true,
    select: false,
  })
  readonly updated_at: Date;
}
