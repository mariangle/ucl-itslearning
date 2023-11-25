"use client"

import React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { ListEntry, ListResponse } from "@/types";
import useLists from "@/helpers/hooks/use-lists";
import { FaTrash } from "react-icons/fa";
import { extractNlpList, handleError } from "@/helpers/util";
import ListPreview from "./list-preview";
import AlertModal from "@/components/modals/alert-modal";

interface FormProps {
    list: ListResponse | null,
    onClose: () => void,
}

const ListForm = ({
    list,
    onClose,
} : FormProps) => {
    const action = list ? 'Save Changes' : 'Create'

    const [isLoading, setIsLoading] = React.useState<boolean>(false); 
    const [isOpen, setIsOpen] = React.useState<boolean>(false);
    const [input, setInput] = React.useState<string>('')
    const [extractedList, setExtractedList] = React.useState<ListEntry | null>(null);
    const router = useRouter();
    const { createList, updateList, deleteList } = useLists();
      
    React.useEffect(() => {
      const updateTask = async () => {
          const list = await extractNlpList(input);
          setExtractedList(list);
      };
      updateTask();
    }, [input]);

    React.useEffect(() => {
      setInput(list ? `${list.emoji || ''} ${list?.name || ''}` : '');
    }, [list]);    

    const onSubmit = async () => {
      try {
        setIsLoading(true)

        if (!extractedList) return;
        const newList: ListEntry = list
        ? { id: list.id, ...extractedList }
        : extractedList;
        
        list 
        ? await updateList(list.id, newList)
        : await createList(newList)

        router.refresh();
        router.push('/dashboard')
        onClose();
      } catch (error) {
        handleError(error)
      } finally {
          setIsLoading(false)
      }
    }

    const test = () => {
      alert("lcikc")
      onClose();
    }
    
    const onDelete = async () => {
        if (!list) return;
    
        try {
          await deleteList(list.id);
          router.refresh();
          onClose();
        } catch (error) {
          handleError(error)
          setIsOpen(false);
        }
      };

  return (
    <>  
      <AlertModal 
        isOpen={isOpen} 
        description="All tasks in this list will be deleted."
        onClose={() => setIsOpen(false)}
        onConfirm={onDelete}
        loading={isLoading}
      />
      <Input id="name" 
          placeholder="Eg. '💼 Work'"
          value={input || ''}
          onChange={((e) => setInput(e.target.value))}
      />
      <ListPreview list={extractedList}/>
      <div className="flex-gap">
        <Button
            type="submit"
            onClick={onSubmit}
        >
            {action}
        </Button>
        {list && (
            <Button type="button" color="danger" onClick={() => setIsOpen(true)}><FaTrash /></Button>
        )}
      </div>
    </>
  )
}

export default ListForm