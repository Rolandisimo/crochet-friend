import { GridImageCoordinator } from '../components/symbol-grid/grid-image-coordinator';
import { Command } from './types';

export class DeleteImageCommand implements Command {
  private gridCoordinator = GridImageCoordinator.getInstance();

  private imageKey: string;
  constructor() {
    this.imageKey = '';
  }

  public execute(): void {
    this.gridCoordinator.removeImage(this.imageKey);
  }
}
