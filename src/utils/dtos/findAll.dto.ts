import { IsNumber, IsObject, IsOptional } from "class-validator";

export class FindAllDto {
  @IsNumber()
  @IsOptional()
  previous?: number;
  
  @IsNumber()
  @IsOptional()
  next?: number;
  
  @IsNumber()
  @IsOptional()
  pageSize?: number;
  
  @IsObject()
  @IsOptional()
  where?: any;

  @IsObject()
  @IsOptional()
  select?: any;

  @IsOptional()
  @IsObject()
  orderBy?: any;
}
