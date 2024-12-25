import {
  Dialog,
  DialogDescription,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";

type LinkDialogProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setURL: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: ()=>void;
};

const LinkDialog = ({
  open, 
  setOpen,
  setURL,
  onSubmit
}: LinkDialogProps)=>{

  const onConfirm = ()=>{
    onSubmit();
    setOpen(!open); 
  }

  return (
    <Dialog open={open} onOpenChange={()=>setOpen(!open)} defaultOpen={false}>
      <DialogContent className="px-5 bg-main dark:bg-dark_main border-none">
        <DialogHeader>
          <DialogTitle className="text-xl text-left font-bold">Add Link</DialogTitle>
          <DialogDescription className="text-md text-left">Enter the link you want to embed.</DialogDescription> 
        </DialogHeader>
        <input 
          type="text" 
          placeholder="Enter URL" 
          className="w-full p-2 border-2 border-gray-300 dark:border-neutral-700 rounded-md ring-none outline-none" 
          onChange={(e)=>setURL(e.target.value)}
        />
        <DialogFooter>
          <Button type="submit" variant={'outline'} onClick={onConfirm}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default LinkDialog;