import { Command } from './types';
import { GridImageCoordinator } from '../components/symbol-grid/grid-image-coordinator';

export class DeleteImageCommand implements Command {
  private gridCoordinator = GridImageCoordinator.getInstance();

  private imageKey: string;
  constructor() {}

  public execute(): void {
    this.gridCoordinator.removeImage(this.imageKey);
  }
}
