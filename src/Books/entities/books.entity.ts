import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ReviewsEntity } from '~/reviews/entities/comment.entity';
import { RatingEntity } from '~/rating/entities/rating.entity';

@Entity({ name: 'livres' })
export class BookEntity extends BaseEntity {
  @ApiProperty({
    description: 'Identifiant unique du livre',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @ApiProperty({
    description: 'Titre du livre',
    example: 'Les Misérables',
  })
  @Column({ type: 'varchar', length: 254, nullable: false })
  readonly title: string;

  @ApiProperty({
    description: "Nom de l'auteur du livre",
    example: 'Victor Hugo',
  })
  @Column({ type: 'varchar', length: 100, nullable: false })
  readonly author: string;

  @ApiProperty({
    description: 'Liste des commentaires associés au livre',
    type: () => [ReviewsEntity],
    isArray: true,
  })
  @OneToMany(() => ReviewsEntity, (reviews) => reviews.book, { cascade: true })
  reviews: ReviewsEntity[];

  averageRating?: number;

  @ApiProperty({
    description: 'Liste of orders',
    type: () => [RatingEntity],
    isArray: true,
  })
  @OneToMany(() => RatingEntity, (ratings) => ratings.book)
  ratings: RatingEntity[];

  @ApiProperty({
    description: 'Date de création du livre',
    example: '2016-10-19T13:24:51.000Z',
  })
  @CreateDateColumn({
    type: 'timestamp with time zone',
    nullable: true,
  })
  readonly created_at: Date;

  @ApiProperty({
    description: 'Date de la dernière mise à jour du livre',
    example: '2016-10-19T13:24:51.000Z',
  })
  @UpdateDateColumn({
    type: 'timestamp with time zone',
    nullable: true,
    select: false,
  })
  readonly updated_at: Date;
}
