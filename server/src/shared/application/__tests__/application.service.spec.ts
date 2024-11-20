import EventEmitter2 from 'eventemitter2';

import { AggregateRoot } from '../../domain';
import { DomainEventMediator } from '../../domain/events';
import { IUnitOfWork } from '../../domain/repository';
import { ValueObject } from '../../domain/value-objects';
import { UnitOfWorkFakeInMemory } from '../../infra/db/in-memory';
import { ApplicationService } from '../application.service';

class StubAggregateRoot extends AggregateRoot {
  public get entity_id(): ValueObject {
    throw new Error('Method not implemented.');
  }

  public toJSON(): Record<string, unknown> {
    throw new Error('Method not implemented.');
  }
}

describe('ApplicationService Unpm i --save-dev @types/jest nit Tests', () => {
  let uow: IUnitOfWork;
  let domainEventMediator: DomainEventMediator;
  let applicationService: ApplicationService;

  beforeEach(() => {
    uow = new UnitOfWorkFakeInMemory();
    const eventEmitter = new EventEmitter2();
    domainEventMediator = new DomainEventMediator(eventEmitter);
    applicationService = new ApplicationService(uow, domainEventMediator);
  });

  describe('start', () => {
    it('should call the start method of unit of work', () => {
      const startSpy = jest.spyOn(uow, 'start');
      applicationService.start();
      expect(startSpy).toHaveBeenCalled();
    });
  });

  describe('finish', () => {
    it('should call the publish method of domain event mediator and the commit method', async () => {
      const aggregateRoot = new StubAggregateRoot();
      uow.addAggregateRoot(aggregateRoot);
      const publishSpy = jest.spyOn(domainEventMediator, 'publish');
      const commitSpy = jest.spyOn(uow, 'commit');
      await applicationService.finish();
      expect(publishSpy).toHaveBeenCalledWith(aggregateRoot);
      expect(commitSpy).toHaveBeenCalled();
    });
  });

  describe('fail', () => {
    it('should call the rollback method of unit of work', () => {
      const rollbackSpy = jest.spyOn(uow, 'rollback');
      applicationService.fail();
      expect(rollbackSpy).toHaveBeenCalled();
    });
  });

  describe('run', () => {
    it('should start, execute the callback, finish and return the result', async () => {
      const callback = jest.fn().mockResolvedValue('result');
      const spyStart = jest.spyOn(applicationService, 'start');
      const spyFinish = jest.spyOn(applicationService, 'finish');

      const result = await applicationService.run(callback);

      expect(spyStart).toHaveBeenCalled();
      expect(callback).toHaveBeenCalled();
      expect(spyFinish).toHaveBeenCalled();
      expect(result).toBe('result');
    });

    it('should rollback and throw the error if the callback throws an error', async () => {
      const callback = jest.fn().mockRejectedValue(new Error('test-error'));
      const spyFail = jest.spyOn(applicationService, 'fail');
      await expect(applicationService.run(callback)).rejects.toThrow(
        'test-error',
      );
      expect(spyFail).toHaveBeenCalled();
    });
  });
});
