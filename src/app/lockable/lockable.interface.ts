export interface Lockable {
    IsLocked: boolean;
    Lock(thing: any): true;
    Unlock(thing: any);
    
}