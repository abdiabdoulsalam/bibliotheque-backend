import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BookEntity } from '~/Books/entities/books.entity';
import { UserEntity } from '~/users/entities/user.entity';

@Entity({ name: 'reviews' })
export class RatingEntity {
  @ApiProperty({
    description: 'Unique identifiant du rating',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @ApiProperty({
    description: 'rating',
    example: '1',
  })
  @Column({ type: 'int', nullable: false })
  note: number;

  @ApiProperty({
    description: 'Produit lié au commentaire',
    type: () => UserEntity,
  })
  @ManyToOne(() => UserEntity, (user) => user.ratings)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;

  @ApiProperty({
    description: 'Liste des demandes envoyer',
    type: () => BookEntity,
  })
  @ManyToOne(() => BookEntity, (book) => book.ratings)
  @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
  book: BookEntity;

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
