
export interface SongGenre{
    id: string;
    image_cover: string;
}
export interface Song {
  id: string;
  name: string;
  artist_name: string;
  image_cover: string;
  duration:number;
  url:string;
  lyrics: any[] | null; // Thay thế unknown bằng kiểu dữ liệu thực tế nếu có
  sentences: any[] | null; // Thay thế unknown bằng kiểu dữ liệu thực tế nếu có
}