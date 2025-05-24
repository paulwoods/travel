export interface Address {
    id: string;
    text: string;
    isSelected: boolean;
    isStart: boolean;
    isDestination: boolean;
}

export const INITIAL_ADDRESSES: Address[] = [
    { id: '1', text: '1234 Legacy Drive, Plano, TX 75024', isSelected: true, isStart: false, isDestination: false },
    { id: '2', text: '5678 Preston Road, Plano, TX 75093', isSelected: true, isStart: false, isDestination: false },
    { id: '3', text: '9012 Coit Road, Plano, TX 75075', isSelected: true, isStart: false, isDestination: false },
    { id: '4', text: '3456 Spring Creek Parkway, Plano, TX 75023', isSelected: true, isStart: false, isDestination: false },
    { id: '5', text: '7890 Park Boulevard, Plano, TX 75074', isSelected: true, isStart: false, isDestination: false },
    { id: '6', text: '2345 Alma Drive, Plano, TX 75023', isSelected: true, isStart: false, isDestination: false },
    { id: '7', text: '6789 Independence Parkway, Plano, TX 75075', isSelected: true, isStart: false, isDestination: false },
    { id: '8', text: '0123 Custer Road, Plano, TX 75075', isSelected: true, isStart: false, isDestination: false },
    { id: '9', text: '4567 Hedgcoxe Road, Plano, TX 75093', isSelected: true, isStart: false, isDestination: false },
    { id: '10', text: '8901 Ohio Drive, Plano, TX 75024', isSelected: true, isStart: false, isDestination: false },
]; 